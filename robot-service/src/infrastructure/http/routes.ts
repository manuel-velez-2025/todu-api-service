import { Router } from 'express';
import { RobotController } from './robotController';

export function createRobotRouter(robotController: RobotController): Router {
  const router = Router();

  router.post('/evento', robotController.processEvent);
  router.get('/estado/:userId', robotController.getState);

  return router;
}
