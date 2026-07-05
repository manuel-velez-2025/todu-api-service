import { Router } from 'express';
import { GamificationController } from './gamificationController';
import { XpController } from './xpController';

export function createGamificationRouter(gamificationController: GamificationController): Router {
  const router = Router();

  router.post('/xp', gamificationController.addXp);
  router.get('/progreso/:userId', gamificationController.getProgress);

  return router;
}

export function createXpRouter(xpController: XpController): Router {
  const router = Router();

  router.post('/xp/atomic', xpController.addXp);
  router.get('/progreso/:userId', xpController.getProgress);

  return router;
}

