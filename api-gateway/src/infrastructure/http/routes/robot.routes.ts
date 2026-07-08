import { Router, Request, Response } from 'express';
import axios from 'axios';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkLevel } from '../middlewares/checkLevel.middleware';

const ROBOT_SERVICE_URL = process.env.ROBOT_SERVICE_URL || 'http://localhost:3004';

const router = Router();

router.use(authMiddleware);
router.use(checkLevel(1));
router.post('/evento', async (req: Request, res: Response) => {
  try {
    console.log(`Connecting to: ${ROBOT_SERVICE_URL}/robot/evento`);
    const response = await axios.post(`${ROBOT_SERVICE_URL}/robot/evento`, req.body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.authorization as string,
        'x-user-id': req.headers['x-user-id'] as string,
      },
    });
    res.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 502;
    res.status(status).json(error.response?.data || { error: 'Error al conectar con robot-service' });
  }
});

router.get('/estado/:userId', async (req: Request, res: Response) => {
  try {
    console.log(`Connecting to: ${ROBOT_SERVICE_URL}/robot/estado/${req.params.userId}`);
    const response = await axios.get(`${ROBOT_SERVICE_URL}/robot/estado/${req.params.userId}`, {
      headers: { Authorization: req.headers.authorization as string },
    });
    res.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 502;
    res.status(status).json(error.response?.data || { error: 'Error al conectar con robot-service' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    console.log(`Connecting to: ${ROBOT_SERVICE_URL}/robot`);
    const response = await axios.get(`${ROBOT_SERVICE_URL}/robot`, {
      headers: {
        Authorization: req.headers.authorization as string,
        'x-user-id': req.headers['x-user-id'] as string,
      },
    });
    res.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 502;
    res.status(status).json(error.response?.data || { error: 'Error al conectar con robot-service' });
  }
});

router.put('/', async (req: Request, res: Response) => {
  try {
    console.log(`Connecting to: ${ROBOT_SERVICE_URL}/robot`);
    const response = await axios.put(`${ROBOT_SERVICE_URL}/robot`, req.body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.authorization as string,
        'x-user-id': req.headers['x-user-id'] as string,
      },
    });
    res.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 502;
    res.status(status).json(error.response?.data || { error: 'Error al conectar con robot-service' });
  }
});

export default router;
