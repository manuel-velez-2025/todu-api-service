import express from 'express';
import { createTaskRouter } from './infrastructure/http/routes';
import { TaskController } from './infrastructure/http/taskController';
import { TaskService } from './application/taskService';
import { TaskRepository } from './infrastructure/database/taskRepository';

const app = express();
app.use(express.json());

const taskRepo = new TaskRepository();
const taskService = new TaskService(taskRepo);
const taskController = new TaskController(taskService);

const taskRouter = createTaskRouter(taskController);
app.use('/tareas', taskRouter);

app.listen(3002, () => {
  console.log('task-service corriendo en http://localhost:3002');
});

export default app;
