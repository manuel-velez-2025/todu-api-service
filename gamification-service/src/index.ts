import express from 'express';
import { testConnection } from './infrastructure/database/db';
import { GamificationRepository } from './infrastructure/database/gamificationRepository';
import { GamificationService } from './application/gamificationService';
import { XpService } from './application/xpService';
import { GamificationController } from './infrastructure/http/gamificationController';
import { XpController } from './infrastructure/http/xpController';
import { createGamificationRouter, createXpRouter } from './infrastructure/http/routes';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', servicio: 'gamification-service' });
});

const repo = new GamificationRepository();
const service = new GamificationService(repo);
const xpService = new XpService(repo);
const controller = new GamificationController(service);
const xpController = new XpController(xpService);
const router = createGamificationRouter(controller);
const xpRouter = createXpRouter(xpController);

app.use('/gamificacion', router);
app.use('/xp', xpRouter);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3003;

testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`gamification-service corriendo en puerto ${PORT}`);
    console.log('Endpoints: /gamificacion/xp, /xp/atomic, /xp/progreso/:userId');
  });
});

export default app;

