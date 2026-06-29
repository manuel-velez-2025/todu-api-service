import { db } from '../infrastructure/database/db';
import { tareas } from '../infrastructure/database/schema';
import { CreateTaskDTO } from '../domain/task';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

export class TaskService {
    
    async createTask(data: CreateTaskDTO) {
        const nuevaTarea = {
            id: uuidv4(),
            usuarioId: 'usuario-temp-01',
            titulo: data.titulo,
            descripcion: data.descripcion,
            xpValor: data.xpValor,
            estado: 'pending',
            fechaCreacion: new Date(),
        };

        await db.insert(tareas).values(nuevaTarea);
        return nuevaTarea;
    }
    async getAllTasks() {
        return await db.select().from(tareas);
      
    }
    async updateTask(id: string, data: Partial<CreateTaskDTO>) {
        const result = await db.update(tareas)
            .set(data)
            .where(eq(tareas.id, id))
            .returning();
        return result;
    }

    async deleteTask(id: string) {
        await db.delete(tareas).where(eq(tareas.id, id));
        return { mensaje: 'Tarea eliminada exitosamente' };
    }
}