import { IGamificationRepository } from './IGamificationRepository';
import { calcularNivel, xpForLevel, progresoPorcentaje } from '../domain/gamification';

const ROBOT_SERVICE_URL = process.env.ROBOT_SERVICE_URL || 'http://robot-service:3004';

export interface AddXpResult {
  userId: string;
  xpActual: number;
  xpAgregado: number;
  xpSiguienteNivel: number;
  nivel: number;
  nivelAnterior: number;
  subioDeNivel: boolean;
  rachaActual: number;
  tareasCompletadas: number;
  progresoPorcentaje: number;
}

export class XpService {
  constructor(private repo: IGamificationRepository) {}

  async addXp(userId: string, amount: number): Promise<AddXpResult> {
    const current = await this.repo.findByUserId(userId);
    const xpPrevio = current?.xpActual ?? 0;
    const tareasPrevia = current?.tareasCompletadas ?? 0;
    const nivelAnterior = calcularNivel(xpPrevio);
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);

    let nuevaRacha: number;
    if (current) {
      const ultima = new Date(current.ultimaActividad);
      if (ultima.toDateString() === ayer.toDateString()) {
        nuevaRacha = current.rachaActual + 1;
      } else if (ultima.toDateString() !== hoy.toDateString()) {
        nuevaRacha = 1;
      } else {
        nuevaRacha = current.rachaActual;
      }
    } else {
      nuevaRacha = amount > 0 ? 1 : 0;
    }

    const tareasCompletadas = tareasPrevia + 1;
    const xpFinal = xpPrevio + amount;
    const nuevoNivel = calcularNivel(xpFinal);
    const progress = await this.repo.addXpAtomically(
      userId,
      amount,
      nuevoNivel,
      nuevaRacha,
      hoy,
      tareasCompletadas,
    );

    const subioDeNivel = progress.nivel > nivelAnterior;
    if (subioDeNivel) {
      this.notificarSubidaNivel(userId, progress.nivel).catch((err) =>
        console.error('Error al notificar a robot-service:', err),
      );
    }

    return {
      userId: progress.userId,
      xpActual: progress.xpActual,
      xpAgregado: amount,
      xpSiguienteNivel: xpForLevel(progress.nivel + 1),
      nivel: progress.nivel,
      nivelAnterior,
      subioDeNivel,
      rachaActual: progress.rachaActual,
      tareasCompletadas: progress.tareasCompletadas,
      progresoPorcentaje: progresoPorcentaje(progress.xpActual, progress.nivel),
    };
  }
  async getProgress(userId: string): Promise<AddXpResult | null> {
    const progress = await this.repo.findByUserId(userId);
    if (!progress) return null;

    return {
      userId: progress.userId,
      xpActual: progress.xpActual,
      xpAgregado: 0,
      xpSiguienteNivel: xpForLevel(progress.nivel + 1),
      nivel: progress.nivel,
      nivelAnterior: progress.nivel,
      subioDeNivel: false,
      rachaActual: progress.rachaActual,
      tareasCompletadas: progress.tareasCompletadas,
      progresoPorcentaje: progresoPorcentaje(progress.xpActual, progress.nivel),
    };
  }

  private async notificarSubidaNivel(userId: string, nivel: number): Promise<void> {
    await fetch(`${ROBOT_SERVICE_URL}/robot/evento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, event: 'LEVEL_UP', nivel }),
    });
  }
}

