import { eq } from 'drizzle-orm';
import { db } from './db';
import { robotState } from './schema';
import { RobotState } from '../../domain/robot';
import { IRobotRepository } from '../../application/IRobotRepository';

export class RobotRepository implements IRobotRepository {
  private mapToDomain(row: any): RobotState {
    return {
      id: row.id,
      userId: row.userId,
      emotion: row.emotion,
      nivel: row.nivel,
      ultimaActividad: row.ultimaActividad ?? new Date(),
      fechaCreacion: row.fechaCreacion ?? new Date(),
    };
  }

  async findByUserId(userId: string): Promise<RobotState | null> {
    const rows = await db.select().from(robotState).where(eq(robotState.userId, userId));
    return rows.length > 0 ? this.mapToDomain(rows[0]) : null;
  }

  async create(state: RobotState): Promise<void> {
    await db.insert(robotState).values({
      id: state.id!,
      userId: state.userId,
      emotion: state.emotion,
      nivel: state.nivel,
      ultimaActividad: state.ultimaActividad,
      fechaCreacion: state.fechaCreacion,
    });
  }

  async update(userId: string, data: Partial<RobotState>): Promise<void> {
    await db.update(robotState)
      .set({
        ...(data.emotion !== undefined && { emotion: data.emotion }),
        ...(data.nivel !== undefined && { nivel: data.nivel }),
        ...(data.ultimaActividad !== undefined && { ultimaActividad: data.ultimaActividad }),
      })
      .where(eq(robotState.userId, userId));
  }
}
