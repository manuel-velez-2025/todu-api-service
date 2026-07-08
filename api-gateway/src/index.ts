import express from 'express';
import cors from 'cors';
import { loggerMiddleware } from './infrastructure/http/middlewares/logger.middleware';
import authRoutes from './infrastructure/http/routes/auth.routes';
import profileRoutes from './infrastructure/http/routes/perfil.routes';
import inventarioRoutes from './infrastructure/http/routes/inventario.routes';
import tareasRoutes from './infrastructure/http/routes/tareas.routes';
import gamificacionRoutes from './infrastructure/http/routes/gamificacion.routes';
import robotRoutes from './infrastructure/http/routes/robot.routes';
import xpRoutes from './infrastructure/http/routes/xp.routes';
import geoRoutes from './infrastructure/http/routes/geo.routes';


const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use(loggerMiddleware);

app.use('/auth', authRoutes);
app.use(profileRoutes);
app.use(inventarioRoutes);
app.use('/tareas', tareasRoutes);
app.use('/gamificacion', gamificacionRoutes);
app.use('/robot', robotRoutes);

app.use('/xp', xpRoutes);
app.use('/geo', geoRoutes);

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    servicios: {
      user: process.env.USER_SERVICE_URL || 'http://localhost:3001',
      task: process.env.TASK_SERVICE_URL || 'http://localhost:3002',
      gamification: process.env.GAMIFICATION_SERVICE_URL || 'http://localhost:3003',
      robot: process.env.ROBOT_SERVICE_URL || 'http://localhost:3004',
      geo: process.env.GEO_SERVICE_URL || 'http://localhost:3005',
    },
  });
});

app.listen(3000, () => {
  console.log('api-gateway corriendo en http://localhost:3000');
});

export default app;
