import express from 'express';
import { createAuthRouter } from './infrastructure/http/routes';
import { AuthController } from './infrastructure/http/authController';
import { AuthService } from './application/authService';
import { UserRepository } from './infrastructure/database/userRepository';

const app = express();
app.use(express.json());

// Inyección de dependencias
const userRepo = new UserRepository();
const authService = new AuthService(userRepo);
const authController = new AuthController(authService);

// Rutas
const authRouter = createAuthRouter(authController);
app.use('/auth', authRouter);

app.listen(3001, () => {
  console.log('user-service corriendo en http://localhost:3001');
});

export default app;
