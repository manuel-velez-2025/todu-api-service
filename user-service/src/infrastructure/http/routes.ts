import { Router } from 'express';
import { AuthController } from './authController';
import { ProfileController } from './profileController';
import { authMiddleware } from './authMiddleware';

export function createAuthRouter(authController: AuthController): Router {
  const authRouter = Router();

  authRouter.post('/register', authController.register);
  authRouter.post('/login', authController.login);

  authRouter.post('/google', authController.googleAuth);
  authRouter.get('/google/callback', authController.googleCallback);

  return authRouter;
}

export function createProfileRouter(profileController: ProfileController): Router {
  const profileRouter = Router();

  profileRouter.get('/perfil', authMiddleware, profileController.getProfile);
  profileRouter.put('/perfil/username', authMiddleware, profileController.updateUsername);
  profileRouter.put('/perfil/password', authMiddleware, profileController.changePassword);
  profileRouter.delete('/perfil', authMiddleware, profileController.deleteAccount);

  return profileRouter;
}
