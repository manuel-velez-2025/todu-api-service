import { Request, Response } from 'express';
import { TaskService } from '../../application/taskService';

const servicioTareas = new TaskService();

export const crearTareaControlador = async (req: Request, res: Response) => {
    try {
        const tareaCreada = await servicioTareas.createTask(req.body);
        res.status(201).json({ mensaje: 'Tarea creada', tarea: tareaCreada });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al procesar la tarea' });
    }
};

export const obtenerTareasControlador = async (req: Request, res: Response) => {
    try {
        const tareas = await servicioTareas.getAllTasks();
        res.status(200).json(tareas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener las tareas' });
    }
    
};
export const actualizarTareaControlador = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const datosActualizados = await servicioTareas.updateTask(id, req.body);
        res.status(200).json({ mensaje: 'Tarea actualizada', tarea: datosActualizados });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar' });
    }
};

export const borrarTareaControlador = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await servicioTareas.deleteTask(id);
        res.status(200).json({ mensaje: 'Tarea eliminada' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al borrar' });
    }
};