import { Router } from 'express';
import { TaskController } from './taskController';
import { authMiddleware } from './middlewares/authMiddleware';
import { uploadMiddleware } from './middlewares/upload';

export function createTaskRouter(taskController: TaskController): Router {
  const taskRouter = Router();

  taskRouter.post('/', authMiddleware, taskController.crearTarea);
  taskRouter.get('/', authMiddleware, taskController.obtenerTareas);
  taskRouter.get('/mis-tareas', authMiddleware, taskController.misTareas);
  taskRouter.get('/:id', authMiddleware, taskController.obtenerTareaPorId);
  taskRouter.put('/:id', authMiddleware, taskController.actualizarTarea);
  taskRouter.delete('/:id', authMiddleware, taskController.borrarTarea);
  taskRouter.post('/:id/evidencia', authMiddleware, uploadMiddleware, taskController.subirEvidencia);

  return taskRouter;
}
