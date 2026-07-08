import express from 'express';
import { testConnection } from './infrastructure/database/db';
import { RobotRepository } from './infrastructure/database/robotRepository';
import { RobotService } from './application/robotService';
import { RobotController } from './infrastructure/http/robotController';
import { createRobotRouter } from './infrastructure/http/routes';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', servicio: 'robot-service' });
});

const repo = new RobotRepository();
const service = new RobotService(repo);
const controller = new RobotController(service);
const router = createRobotRouter(controller);

app.use('/robot', router);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3004;

testConnection().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`robot-service corriendo en puerto ${PORT}`);
  });
});

export default app;
