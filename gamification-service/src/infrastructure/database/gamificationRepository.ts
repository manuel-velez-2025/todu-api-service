import { eq } from 'drizzle-orm';
import { db } from './db';
import { userProgress } from './schema';
import { UserProgress } from '../../domain/gamification';
import { IGamificationRepository } from '../../application/IGamificationRepository';

export class GamificationRepository implements IGamificationRepository {
  private mapToDomain(row: any): UserProgress {
    return {
      id: row.id,
      userId: row.userId,
      xpActual: row.xpActual,
      nivel: row.nivel,
      rachaActual: row.rachaActual,
      ultimaActividad: row.ultimaActividad ?? new Date(),
      tareasCompletadas: row.tareasCompletadas,
      fechaCreacion: row.fechaCreacion ?? new Date(),
    };
  }

  async findByUserId(userId: string): Promise<UserProgress | null> {
    const rows = await db.select().from(userProgress).where(eq(userProgress.userId, userId));
    return rows.length > 0 ? this.mapToDomain(rows[0]) : null;
  }

  async create(progress: UserProgress): Promise<void> {
    await db.insert(userProgress).values({
      id: progress.id!,
      userId: progress.userId,
      xpActual: progress.xpActual,
      nivel: progress.nivel,
      rachaActual: progress.rachaActual,
      ultimaActividad: progress.ultimaActividad,
      tareasCompletadas: progress.tareasCompletadas,
      fechaCreacion: progress.fechaCreacion,
    });
  }

  async update(userId: string, data: Partial<UserProgress>): Promise<void> {
    await db.update(userProgress)
      .set({
        ...(data.xpActual !== undefined && { xpActual: data.xpActual }),
        ...(data.nivel !== undefined && { nivel: data.nivel }),
        ...(data.rachaActual !== undefined && { rachaActual: data.rachaActual }),
        ...(data.ultimaActividad !== undefined && { ultimaActividad: data.ultimaActividad }),
        ...(data.tareasCompletadas !== undefined && { tareasCompletadas: data.tareasCompletadas }),
      })
      .where(eq(userProgress.userId, userId));
  }
}
