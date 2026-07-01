import { Router } from 'express';
import { AuthController } from './authController';

export function createAuthRouter(authController: AuthController): Router {
  const authRouter = Router();

  authRouter.post('/register', authController.register);
  authRouter.post('/login', authController.login);

  authRouter.post('/google', authController.googleAuth);
  authRouter.get('/google/callback', authController.googleCallback);

  return authRouter;
}
