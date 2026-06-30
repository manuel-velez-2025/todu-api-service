import { Request, Response } from 'express';
import { TaskService } from '../../application/taskService';
import { CreateTaskDTO } from '../../domain/task';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export class TaskController {
  constructor(private taskService: TaskService) {}

  crearTarea = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarioId = (req as any).user?.id;
      if (!usuarioId) {
        res.status(401).json({ mensaje: 'Usuario no autenticado' });
        return;
      }

      const { titulo, descripcion, xpValor } = req.body;
      if (!titulo) {
        res.status(400).json({ mensaje: 'El título es requerido' });
        return;
      }

      const dto: CreateTaskDTO = { titulo, descripcion: descripcion || '', xpValor: xpValor || 10 };
      const tarea = await this.taskService.createTask(usuarioId, dto);
      res.status(201).json({ mensaje: 'Tarea creada', tarea });
    } catch (error) {
      console.error('Error al crear tarea:', error);
      res.status(500).json({ mensaje: 'Error al procesar la tarea' });
    }
  };

  obtenerTareas = async (_req: Request, res: Response): Promise<void> => {
    try {
      const tareas = await this.taskService.getAllTasks();
      res.status(200).json(tareas);
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      res.status(500).json({ mensaje: 'Error al obtener las tareas' });
    }
  };

  obtenerTareaPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const tarea = await this.taskService.getTaskById(id);

      if (!tarea) {
        res.status(404).json({ mensaje: 'Tarea no encontrada' });
        return;
      }

      res.status(200).json(tarea);
    } catch (error) {
      console.error('Error al obtener tarea:', error);
      res.status(500).json({ mensaje: 'Error al obtener la tarea' });
    }
  };

  misTareas = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarioId = (req as any).user?.id;
      if (!usuarioId) {
        res.status(401).json({ mensaje: 'Usuario no autenticado' });
        return;
      }

      const tareas = await this.taskService.getUserTasks(usuarioId);
      res.status(200).json(tareas);
    } catch (error) {
      console.error('Error al obtener tareas del usuario:', error);
      res.status(500).json({ mensaje: 'Error al obtener tus tareas' });
    }
  };

  actualizarTarea = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const tareaActualizada = await this.taskService.updateTask(id, req.body);
      res.status(200).json({ mensaje: 'Tarea actualizada', tarea: tareaActualizada });
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      res.status(500).json({ mensaje: 'Error al actualizar' });
    }
  };

  borrarTarea = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.taskService.deleteTask(id);
      res.status(200).json({ mensaje: 'Tarea eliminada' });
    } catch (error) {
      console.error('Error al borrar tarea:', error);
      res.status(500).json({ mensaje: 'Error al borrar' });
    }
  };

  subirEvidencia = async (req: Request, res: Response): Promise<void> => {
    try {
      const multerReq = req as MulterRequest;
      const taskId = multerReq.params.id as string;
      const usuarioId = (req as any).user?.id;

      if (!usuarioId) {
        res.status(401).json({ mensaje: 'Usuario no autenticado' });
        return;
      }

      if (!multerReq.file) {
        res.status(400).json({ mensaje: 'Archivo de evidencia requerido' });
        return;
      }

      const result = await this.taskService.submitEvidence(taskId, usuarioId, multerReq.file.buffer);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Tarea no encontrada') {
        res.status(404).json({ mensaje: error.message });
        return;
      }
      if (error.message?.includes('permiso')) {
        res.status(403).json({ mensaje: error.message });
        return;
      }
      console.error('Error al subir evidencia:', error);
      res.status(500).json({ mensaje: 'Error al procesar la evidencia' });
    }
  };
}
