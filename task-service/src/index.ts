import express from 'express';
import { createTaskRouter } from './infrastructure/http/routes';
import { TaskController } from './infrastructure/http/taskController';
import { TaskService } from './application/taskService';
import { TaskRepository } from './infrastructure/database/taskRepository';
import { CloudinaryAdapter } from './infrastructure/external/cloudinaryAdapter';
import { ClaudeVisionAdapter } from './infrastructure/external/claudeVisionAdapter';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', servicio: 'task-service' });
});

const taskRepo = new TaskRepository();
const cloudinaryAdapter = new CloudinaryAdapter();
const claudeVisionAdapter = new ClaudeVisionAdapter();

const taskService = new TaskService(taskRepo, cloudinaryAdapter, claudeVisionAdapter);
const taskController = new TaskController(taskService);

const taskRouter = createTaskRouter(taskController);
app.use('/tareas', taskRouter);

app.listen(3002, () => {
  console.log('task-service corriendo en http://localhost:3002');
});

export default app;
