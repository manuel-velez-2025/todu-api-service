// src/infrastructure/http/taskController.ts
import { Request, Response } from 'express';
import { TaskService } from '../../application/taskService';

const taskService = new TaskService();

export const createTaskController = async (req: Request, res: Response) => {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json(task); // 201 Created es el código HTTP correcto
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la tarea' });
  }
};