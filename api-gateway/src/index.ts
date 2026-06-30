import express from 'express';
import proxy from 'express-http-proxy';

const app = express();

const USER_SERVICE = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const TASK_SERVICE = process.env.TASK_SERVICE_URL || 'http://localhost:3002';
const GAMIFICATION_SERVICE = process.env.GAMIFICATION_SERVICE_URL || 'http://localhost:3003';
const ROBOT_SERVICE = process.env.ROBOT_SERVICE_URL || 'http://localhost:3004';
const GEO_SERVICE = process.env.GEO_SERVICE_URL || 'http://localhost:3005';

app.use('/auth', proxy(USER_SERVICE));

app.use('/tareas', proxy(TASK_SERVICE));

app.use('/gamificacion', proxy(GAMIFICATION_SERVICE));

app.use('/robot', proxy(ROBOT_SERVICE));

app.use('/geo', proxy(GEO_SERVICE));

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    servicios: {
      user: USER_SERVICE,
      task: TASK_SERVICE,
      gamification: GAMIFICATION_SERVICE,
      robot: ROBOT_SERVICE,
      geo: GEO_SERVICE,
    },
  });
});

app.listen(3000, () => {
  console.log(' api-gateway corriendo en http://localhost:3000');
});

export default app;
