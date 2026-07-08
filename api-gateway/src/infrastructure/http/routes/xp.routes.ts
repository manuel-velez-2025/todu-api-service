import { Router, Request, Response } from 'express';
import axios from 'axios';
import { authMiddleware } from '../middlewares/auth.middleware';

const GAMIFICATION_SERVICE = process.env.GAMIFICATION_SERVICE_URL || 'http://localhost:3003';

const router = Router();

router.post('/atomic', authMiddleware, async (req: Request, res: Response) => {
  try {
    const response = await axios.post(`${GAMIFICATION_SERVICE}/xp/atomic`, req.body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.authorization as string,
        'x-user-id': req.headers['x-user-id'] as string,
      },
    });
    res.status(response.status).json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 502;
    res.status(status).json(error.response?.data || { error: 'Error al conectar con gamification-service' });
  }
});

router.get('/progreso/:userId', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${GAMIFICATION_SERVICE}/xp/progreso/${req.params.userId}`);
    res.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 502;
    res.status(status).json(error.response?.data || { error: 'Error al conectar con gamification-service' });
  }
});

export default router;
