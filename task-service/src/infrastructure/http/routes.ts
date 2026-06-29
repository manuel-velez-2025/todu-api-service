import { Router } from 'express';
import { crearTareaControlador, obtenerTareasControlador, actualizarTareaControlador, borrarTareaControlador } from './taskController';
import { authMiddleware } from './middlewares/authMiddleware';

const taskRouter = Router();

taskRouter.post('/', authMiddleware, crearTareaControlador);
taskRouter.get('/', authMiddleware, obtenerTareasControlador);
taskRouter.put('/:id', authMiddleware, actualizarTareaControlador);
taskRouter.delete('/:id', authMiddleware, borrarTareaControlador);

export { taskRouter };