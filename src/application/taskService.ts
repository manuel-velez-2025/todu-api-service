import { db } from '../infrastructure/database/db';
import { tareas } from '../infrastructure/database/schema';
import { CreateTaskDTO } from '../domain/task';
import { v4 as uuidv4 } from 'uuid';

export class TaskService {
  
  async createTask(data: CreateTaskDTO) {
    const nuevaTarea = {
      id: uuidv4(),
      usuarioId: 'usuario-temporal-123',
      titulo: data.titulo,
      xpValor: data.xpValor,
      estado: 'pending',
      fechaCreacion: new Date(),
    };
    await db.insert(tareas).values(nuevaTarea);

    console.log('Tarea guardada en PostgreSQL:', nuevaTarea.titulo);
    
    return nuevaTarea;
  }
}