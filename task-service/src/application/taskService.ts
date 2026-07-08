import crypto from 'crypto';
import { Tarea, CreateTaskDTO } from '../domain/task';
import { ITaskRepository } from './ITaskRepository';
import { IStorageProvider } from './IStorageProvider';
import { IVisionProvider } from './IVisionProvider';

const GAMIFICATION_SERVICE_URL = process.env.GAMIFICATION_SERVICE_URL || 'http://gamification-service:3003';
const ROBOT_SERVICE_URL = process.env.ROBOT_SERVICE_URL || 'http://robot-service:3004';

export class TaskService {
  constructor(
    private repo: ITaskRepository,
    private storage?: IStorageProvider,
    private vision?: IVisionProvider,
  ) {}

  async createTask(usuarioId: string, data: CreateTaskDTO): Promise<Tarea> {
    const nuevaTarea: Tarea = {
      id: crypto.randomUUID(),
      usuarioId,
      titulo: data.titulo,
      descripcion: data.descripcion,
      xpValor: data.xpValor,
      estado: 'pending',
      urlEvidencia: null,
      proofStatus: null,
      proofReason: null,
      proofConfidence: null,
      fechaCreacion: new Date(),
    };

    await this.repo.create(nuevaTarea);
    return nuevaTarea;
  }

  async getAllTasks(): Promise<Tarea[]> {
    return this.repo.findAll();
  }

  async getTaskById(id: string): Promise<Tarea | null> {
    return this.repo.findById(id);
  }

  async getUserTasks(userId: string): Promise<Tarea[]> {
    return this.repo.findByUserId(userId);
  }

  async updateTask(id: string, data: Partial<Tarea>): Promise<Tarea> {
    return this.repo.update(id, data);
  }

  async deleteTask(id: string): Promise<void> {
    await this.repo.delete(id);
  }
  async completeTask(taskId: string, userId: string): Promise<Tarea> {
    const task = await this.repo.findById(taskId);
    if (!task) {
      throw new Error('Tarea no encontrada');
    }

    if (task.usuarioId !== userId) {
      throw new Error('No tienes permiso para modificar esta tarea');
    }

    if (task.estado === 'completed') {
      throw new Error('La tarea ya está completada');
    }
    
    const response = await fetch(`${GAMIFICATION_SERVICE_URL}/xp/atomic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: task.usuarioId, xp: task.xpValor }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Error al sumar XP: gamification-service respondió con status ${response.status}: ${errorBody}`,
      );
    }

    fetch(`${ROBOT_SERVICE_URL}/robot/evento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: task.usuarioId, event: 'TASK_COMPLETED' }),
    }).catch(err => console.error('Error al notificar a robot-service (TASK_COMPLETED):', err));

    await this.repo.markCompleted(taskId);

    return {
      ...task,
      estado: 'completed',
    };
  }

  async submitEvidence(
    taskId: string,
    userId: string,
    file: Buffer
  ): Promise<{
    estado: string;
    validacion: { approved: boolean; reason: string; confidence: string };
  }> {
    if (!this.storage || !this.vision) {
      throw new Error('StorageProvider y VisionProvider son requeridos para submitEvidence');
    }

    const task = await this.repo.findById(taskId);
    if (!task) {
      throw new Error('Tarea no encontrada');
    }

    if (task.usuarioId !== userId) {
      throw new Error('No tienes permiso para modificar esta tarea');
    }
    const imageUrl = await this.storage.upload(file, 'evidencias');
    const validation = await this.vision.validateEvidence(imageUrl, task.descripcion);

    const nuevoEstado = validation.approved ? 'completed' : 'rejected';
    await this.repo.updateEvidence(taskId, {
      imageUrl,
      estado: nuevoEstado,
      proofReason: validation.reason,
      proofConfidence: validation.confidence,
    });
    if (validation.approved) {
      try {
        await fetch(`${GAMIFICATION_SERVICE_URL}/xp/atomic`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: task.usuarioId, xp: task.xpValor }),
        });
      } catch (error) {
        console.error('Error al notificar a gamification-service:', error);
      }

      fetch(`${ROBOT_SERVICE_URL}/robot/evento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: task.usuarioId, event: 'TASK_COMPLETED' }),
      }).catch(err => console.error('Error al notificar a robot-service (EVIDENCIA_APROBADA):', err));
    }

    return { estado: nuevoEstado, validacion: validation };
  }

}
