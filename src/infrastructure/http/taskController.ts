import { Request, Response } from 'express';
import { TaskService } from '../../application/taskService';

const servicioTareas = new TaskService();

export const crearTareaControlador = async (req: Request, res: Response) => {
  try {
    const datosTarea = req.body;
    const tareaCreada = await servicioTareas.createTask(datosTarea);
    
    res.status(201).json({
      mensaje: 'Tarea creada con éxito',
      tarea: tareaCreada
    });
  } catch (error) {
    console.error('Error en controlador:', error);
    res.status(500).json({ 
      mensaje: 'Error interno al procesar la tarea' 
    });
  }
};