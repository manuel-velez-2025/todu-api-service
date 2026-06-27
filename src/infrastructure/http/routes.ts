import { Router } from 'express';
import { validate } from './middlewares/validate';
import { createTaskSchema } from './validations/task.validation';
import { 
    crearTareaControlador, 
    obtenerTareasControlador, 
    actualizarTareaControlador, 
    borrarTareaControlador 
} from './taskController';

const router = Router();
router.post('/tareas', validate(createTaskSchema), crearTareaControlador);

router.get('/tareas', obtenerTareasControlador);
router.put('/tareas/:id', actualizarTareaControlador);
router.delete('/tareas/:id', borrarTareaControlador);

export default router;