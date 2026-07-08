import express from 'express';
import { createAuthRouter, createProfileRouter, createInventoryRouter } from './infrastructure/http/routes';
import { AuthController } from './infrastructure/http/authController';
import { ProfileController } from './infrastructure/http/profileController';
import { InventoryController } from './infrastructure/http/inventoryController';
import { AuthService } from './application/authService';
import { ProfileService } from './application/profileService';
import { InventoryService } from './application/inventoryService';
import { UserRepository } from './infrastructure/database/userRepository';
import { InventoryRepository } from './infrastructure/database/inventoryRepository';
import { GoogleOAuthAdapter } from './infrastructure/external/googleOAuthAdapter';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', servicio: 'user-service' });
});

const userRepo = new UserRepository();
const inventoryRepo = new InventoryRepository();
const googleOAuth = new GoogleOAuthAdapter();

const authService = new AuthService(userRepo, googleOAuth);
const authController = new AuthController(authService);

const profileService = new ProfileService(userRepo);
const profileController = new ProfileController(profileService);

const inventoryService = new InventoryService(inventoryRepo, userRepo);
const inventoryController = new InventoryController(inventoryService);

const authRouter = createAuthRouter(authController);
const profileRouter = createProfileRouter(profileController);
const inventoryRouter = createInventoryRouter(inventoryController);

app.use('/auth', authRouter);
app.use('/', profileRouter);
app.use('/', inventoryRouter);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

app.listen(PORT, () => {
  console.log(`user-service corriendo en puerto ${PORT}`);
  console.log('Endpoints: /auth/*, /perfil*, /inventario*');
});

export default app;

