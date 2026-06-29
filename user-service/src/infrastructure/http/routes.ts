import { Router } from 'express';
import { registerControlador, loginControlador } from './authController';

const authRouter = Router();

authRouter.post('/register', registerControlador);
authRouter.post('/login', loginControlador);

export { authRouter };