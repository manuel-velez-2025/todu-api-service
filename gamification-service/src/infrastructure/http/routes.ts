import { Router } from 'express';
import { GamificationController } from './gamificationController';

export function createGamificationRouter(gamificationController: GamificationController): Router {
  const router = Router();

  router.post('/xp', gamificationController.addXp);
  router.get('/progress/:userId', gamificationController.getProgress);

  return router;
}
