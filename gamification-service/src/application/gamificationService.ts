import crypto from 'crypto';
import {
  UserProgress,
  AddXpDTO,
  ProgressResponse,
  calcularNivel,
  xpForLevel,
  progresoPorcentaje,
} from '../domain/gamification';
import { IGamificationRepository } from './IGamificationRepository';

const ROBOT_SERVICE_URL = process.env.ROBOT_SERVICE_URL || 'http://robot-service:3004';

export class GamificationService {
  constructor(private repo: IGamificationRepository) {}

  async addXp(dto: AddXpDTO): Promise<ProgressResponse> {
    let progress = await this.repo.findByUserId(dto.userId);

    if (!progress) {
      progress = {
        userId: dto.userId,
        xpActual: 0,
        nivel: 1,
        rachaActual: 0,
        ultimaActividad: new Date(),
        tareasCompletadas: 0,
        fechaCreacion: new Date(),
      };
    }

    progress.xpActual += dto.xp;
    progress.tareasCompletadas += 1;

    const nivelAnterior = progress.nivel;
    progress.nivel = calcularNivel(progress.xpActual);

    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);

    const ultima = new Date(progress.ultimaActividad);
    if (ultima.toDateString() === ayer.toDateString()) {
      progress.rachaActual += 1;
    } else if (ultima.toDateString() !== hoy.toDateString()) {
      progress.rachaActual = 1;
    }

    progress.ultimaActividad = hoy;

    if (!(await this.repo.findByUserId(dto.userId))) {
      progress.id = crypto.randomUUID();
      await this.repo.create(progress);
    } else {
      await this.repo.update(dto.userId, {
        xpActual: progress.xpActual,
        nivel: progress.nivel,
        rachaActual: progress.rachaActual,
        ultimaActividad: progress.ultimaActividad,
        tareasCompletadas: progress.tareasCompletadas,
      });
    }

    if (progress.nivel > nivelAnterior) {
      try {
        await fetch(`${ROBOT_SERVICE_URL}/event`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: dto.userId,
            event: 'LEVEL_UP',
            nivel: progress.nivel,
          }),
        });
      } catch (error) {
        console.error('Error al notificar a robot-service:', error);
      }
    }

    return this.buildResponse(progress);
  }

  async getProgress(userId: string): Promise<ProgressResponse | null> {
    const progress = await this.repo.findByUserId(userId);
    if (!progress) return null;
    return this.buildResponse(progress);
  }

  async getLeaderboard(limit: number = 10): Promise<ProgressResponse[]> {
    return [];
  }

  private buildResponse(progress: UserProgress): ProgressResponse {
    return {
      userId: progress.userId,
      xpActual: progress.xpActual,
      xpSiguienteNivel: xpForLevel(progress.nivel),
      nivel: progress.nivel,
      rachaActual: progress.rachaActual,
      tareasCompletadas: progress.tareasCompletadas,
      progresoPorcentaje: progresoPorcentaje(progress.xpActual, progress.nivel),
    };
  }
}
