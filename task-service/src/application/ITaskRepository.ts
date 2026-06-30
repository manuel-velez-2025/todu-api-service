import { Tarea } from '../domain/task';

export interface ITaskRepository {
  create(task: Tarea): Promise<void>;
  findAll(): Promise<Tarea[]>;
  findById(id: string): Promise<Tarea | null>;
  findByUserId(userId: string): Promise<Tarea[]>;
  update(id: string, data: Partial<Tarea>): Promise<Tarea>;
  delete(id: string): Promise<void>;
  updateEvidence(
    id: string,
    data: {
      imageUrl: string;
      estado: string;
      proofReason: string;
      proofConfidence: string;
    }
  ): Promise<void>;
}
