import { eq } from 'drizzle-orm';
import { db } from './db';
import { tareas } from './schema';
import { Tarea } from '../../domain/task';
import { ITaskRepository } from '../../application/ITaskRepository';

export class TaskRepository implements ITaskRepository {
  private mapToDomain(row: any): Tarea {
    return {
      id: row.id,
      usuarioId: row.usuarioId ?? '',
      titulo: row.titulo,
      descripcion: row.descripcion ?? '',
      xpValor: row.xpValor ?? 0,
      estado: (row.estado ?? 'pending') as Tarea['estado'],
      urlEvidencia: row.urlEvidencia,
      proofStatus: row.proofStatus,
      proofReason: row.proofReason,
      proofConfidence: row.proofConfidence,
      fechaCreacion: row.fechaCreacion ?? new Date(),
    };
  }

  async create(task: Tarea): Promise<void> {
    await db.insert(tareas).values({
      id: task.id,
      usuarioId: task.usuarioId,
      titulo: task.titulo,
      descripcion: task.descripcion,
      xpValor: task.xpValor,
      estado: task.estado,
      urlEvidencia: task.urlEvidencia,
      proofStatus: task.proofStatus,
      proofReason: task.proofReason,
      proofConfidence: task.proofConfidence,
      fechaCreacion: task.fechaCreacion,
    });
  }

  async findAll(): Promise<Tarea[]> {
    const rows = await db.select().from(tareas);
    return rows.map(this.mapToDomain);
  }

  async findById(id: string): Promise<Tarea | null> {
    const rows = await db.select().from(tareas).where(eq(tareas.id, id));
    return rows.length > 0 ? this.mapToDomain(rows[0]) : null;
  }

  async findByUserId(userId: string): Promise<Tarea[]> {
    const rows = await db.select().from(tareas).where(eq(tareas.usuarioId, userId));
    return rows.map(this.mapToDomain);
  }

  async update(id: string, data: Partial<Tarea>): Promise<Tarea> {
    const rows = await db.update(tareas)
      .set({
        ...(data.titulo && { titulo: data.titulo }),
        ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
        ...(data.xpValor !== undefined && { xpValor: data.xpValor }),
        ...(data.estado && { estado: data.estado }),
        ...(data.urlEvidencia !== undefined && { urlEvidencia: data.urlEvidencia }),
        ...(data.proofStatus !== undefined && { proofStatus: data.proofStatus }),
        ...(data.proofReason !== undefined && { proofReason: data.proofReason }),
        ...(data.proofConfidence !== undefined && { proofConfidence: data.proofConfidence }),
      })
      .where(eq(tareas.id, id))
      .returning();
    return this.mapToDomain(rows[0]);
  }

  async delete(id: string): Promise<void> {
    await db.delete(tareas).where(eq(tareas.id, id));
  }

  async updateEvidence(
    id: string,
    data: { imageUrl: string; estado: string; proofReason: string; proofConfidence: string }
  ): Promise<void> {
    await db.update(tareas)
      .set({
        urlEvidencia: data.imageUrl,
        estado: data.estado,
        proofStatus: data.estado === 'completed' ? 'approved' : 'rejected',
        proofReason: data.proofReason,
        proofConfidence: data.proofConfidence,
      })
      .where(eq(tareas.id, id));
  }
}
