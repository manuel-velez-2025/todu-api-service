// src/application/taskService.ts
import { Task, CreateTaskDTO } from '../domain/task';

// Este servicio gestionará la lógica de negocio de las tareas
export class TaskService {
  
  // Lógica para crear una tarea
  async createTask(data: CreateTaskDTO): Promise<Task> {
    // Aquí después inyectaremos la base de datos
    const newTask: Task = {
      id: crypto.randomUUID(), // Generamos un ID único universal
      ...data,
      isCompleted: false,
      createdAt: new Date(),
    };

    console.log('Caso de uso: Tarea creada en memoria:', newTask);
    
    // Regresamos la tarea creada
    return newTask;
  }
}