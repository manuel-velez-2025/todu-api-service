import { Router } from 'express';
import { crearTareaControlador } from './taskController';

const router = Router();

router.post('/tareas', crearTareaControlador);

export default router;