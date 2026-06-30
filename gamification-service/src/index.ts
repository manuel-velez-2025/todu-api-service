import express from 'express';
import { testConnection } from './infrastructure/database/db';
import { GamificationRepository } from './infrastructure/database/gamificationRepository';
import { GamificationService } from './application/gamificationService';
import { GamificationController } from './infrastructure/http/gamificationController';
import { createGamificationRouter } from './infrastructure/http/routes';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', servicio: 'gamification-service' });
});

const repo = new GamificationRepository();
const service = new GamificationService(repo);
const controller = new GamificationController(service);
const router = createGamificationRouter(controller);

app.use(router);

const PORT = 3003;

testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`gamification-service corriendo en http://localhost:${PORT}`);
  });
});

export default app;
