import { eq, sql } from 'drizzle-orm';
import { db, pool } from './db';
import { userProgress } from './schema';
import { UserProgress } from '../../domain/gamification';
import { IGamificationRepository } from '../../application/IGamificationRepository';
import crypto from 'crypto';

export class GamificationRepository implements IGamificationRepository {
  private mapToDomain(row: any): UserProgress {
    return {
      id: row.id,
      userId: row.user_id,
      xpActual: row.xp_actual,
      nivel: row.nivel,
      rachaActual: row.racha_actual,
      ultimaActividad: row.ultima_actividad ?? new Date(),
      tareasCompletadas: row.tareas_completadas,
      fechaCreacion: row.created_at ?? new Date(),
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

  async addXpAtomically(
    userId: string,
    amount: number,
    nuevoNivel: number,
    rachaActual: number,
    ultimaActividad: Date,
    tareasCompletadas: number,
  ): Promise<UserProgress> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        'SELECT * FROM user_progress WHERE user_id = $1 FOR UPDATE',
        [userId],
      );

      let progress: UserProgress;

      if (result.rows.length === 0) {
        const id = crypto.randomUUID();
        await client.query(
          `INSERT INTO user_progress (id, user_id, xp_actual, nivel, racha_actual, ultima_actividad, tareas_completadas, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
          [id, userId, amount, nuevoNivel, rachaActual, ultimaActividad, tareasCompletadas],
        );
        progress = {
          id,
          userId,
          xpActual: amount,
          nivel: nuevoNivel,
          rachaActual,
          ultimaActividad,
          tareasCompletadas,
          fechaCreacion: new Date(),
        };
      } else {
        const row = result.rows[0];
        const nuevoXp = (row.xp_actual || 0) + amount;
        await client.query(
          `UPDATE user_progress
           SET xp_actual = $1, nivel = $2, racha_actual = $3, ultima_actividad = $4, tareas_completadas = $5
           WHERE user_id = $6`,
          [nuevoXp, nuevoNivel, rachaActual, ultimaActividad, tareasCompletadas, userId],
        );
        progress = {
          id: row.id,
          userId,
          xpActual: nuevoXp,
          nivel: nuevoNivel,
          rachaActual,
          ultimaActividad,
          tareasCompletadas,
          fechaCreacion: row.created_at ?? new Date(),
        };
      }

      await client.query('COMMIT');
      return progress;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}



