import express from 'express';
import { createAuthRouter } from './infrastructure/http/routes';
import { AuthController } from './infrastructure/http/authController';
import { AuthService } from './application/authService';
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

const authRouter = createAuthRouter(authController);
app.use('/auth', authRouter);

app.listen(3001, () => {
  console.log('user-service corriendo en http://localhost:3001');
});

export default app;
