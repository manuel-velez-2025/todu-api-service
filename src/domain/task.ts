// src/domain/task.ts

export interface Task {
  id: string;
  title: string;
  description: string;
  xpValue: number;      // Puntos de experiencia (tu sistema de progresión)
  isCompleted: boolean;
  createdAt: Date;
}

// DTO (Data Transfer Object) para crear tareas
export interface CreateTaskDTO {
  title: string;
  description: string;
  xpValue: number;
}