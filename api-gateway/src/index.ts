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
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    return res.sendStatus(204);
  }
  next();
});

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

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(PORT, () => {
  console.log(`api-gateway corriendo en puerto ${PORT}`);
});

export default app;
