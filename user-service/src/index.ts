import express from 'express';
import { createAuthRouter, createProfileRouter } from './infrastructure/http/routes';
import { AuthController } from './infrastructure/http/authController';
import { ProfileController } from './infrastructure/http/profileController';
import { AuthService } from './application/authService';
import { ProfileService } from './application/profileService';
import { UserRepository } from './infrastructure/database/userRepository';
import { GoogleOAuthAdapter } from './infrastructure/external/googleOAuthAdapter';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', servicio: 'user-service' });
});

const userRepo = new UserRepository();
const googleOAuth = new GoogleOAuthAdapter();

const authService = new AuthService(userRepo, googleOAuth);
const authController = new AuthController(authService);

const profileService = new ProfileService(userRepo);
const profileController = new ProfileController(profileService);

const authRouter = createAuthRouter(authController);
const profileRouter = createProfileRouter(profileController);

app.use('/auth', authRouter);
app.use('/', profileRouter);

app.listen(3001, () => {
  console.log('user-service corriendo en http://localhost:3001');
  console.log('Endpoints de perfil: GET/PUT/DELETE /perfil');
});

export default app;
