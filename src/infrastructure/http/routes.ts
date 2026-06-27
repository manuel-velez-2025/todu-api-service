import { Router } from 'express';
import { 
    crearTareaControlador, 
    obtenerTareasControlador, 
    actualizarTareaControlador, 
    borrarTareaControlador 
} from './taskController';

const router = Router();
router.post('/tareas', crearTareaControlador);
router.get('/tareas', obtenerTareasControlador);
router.put('/tareas/:id', actualizarTareaControlador);
router.delete('/tareas/:id', borrarTareaControlador);

export default router;