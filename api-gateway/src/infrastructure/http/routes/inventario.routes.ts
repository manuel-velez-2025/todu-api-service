import { Router, Request, Response } from 'express';
import axios from 'axios';
import { authMiddleware } from '../middlewares/auth.middleware';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';

const router = Router();

router.use(authMiddleware);

router.get('/inventario', async (req: Request, res: Response) => {
  try {
    console.log(`Connecting to: ${USER_SERVICE_URL}/inventario`);
    const userId = req.headers['x-user-id'];
    const response = await axios.get(`${USER_SERVICE_URL}/inventario`, {
      headers: { 'x-user-id': userId, Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 502;
    res.status(status).json(error.response?.data || { error: 'Error al conectar con user-service' });
  }
});

router.post('/inventario/desbloquear', async (req: Request, res: Response) => {
  try {
    console.log(`Connecting to: ${USER_SERVICE_URL}/inventario/desbloquear`);
    const userId = req.headers['x-user-id'];
    const response = await axios.post(`${USER_SERVICE_URL}/inventario/desbloquear`, req.body, {
      headers: { 'x-user-id': userId, Authorization: req.headers.authorization, 'Content-Type': 'application/json' },
    });
    res.status(response.status).json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 502;
    res.status(status).json(error.response?.data || { error: 'Error al conectar con user-service' });
  }
});

router.post('/inventario/agregar', async (req: Request, res: Response) => {
  try {
    console.log(`Connecting to: ${USER_SERVICE_URL}/inventario/agregar`);
    const userId = req.headers['x-user-id'];
    const response = await axios.post(`${USER_SERVICE_URL}/inventario/agregar`, req.body, {
      headers: { 'x-user-id': userId, Authorization: req.headers.authorization, 'Content-Type': 'application/json' },
    });
    res.status(201).json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 502;
    res.status(status).json(error.response?.data || { error: 'Error al conectar con user-service' });
  }
});

router.post('/inventario/equipar', async (req: Request, res: Response) => {
  try {
    console.log(`Connecting to: ${USER_SERVICE_URL}/inventario/equipar`);
    const userId = req.headers['x-user-id'];
    const response = await axios.post(`${USER_SERVICE_URL}/inventario/equipar`, req.body, {
      headers: { 'x-user-id': userId, Authorization: req.headers.authorization, 'Content-Type': 'application/json' },
    });
    res.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 502;
    res.status(status).json(error.response?.data || { error: 'Error al conectar con user-service' });
  }
});

router.post('/inventario/desequipar', async (req: Request, res: Response) => {
  try {
    console.log(`Connecting to: ${USER_SERVICE_URL}/inventario/desequipar`);
    const userId = req.headers['x-user-id'];
    const response = await axios.post(`${USER_SERVICE_URL}/inventario/desequipar`, req.body, {
      headers: { 'x-user-id': userId, Authorization: req.headers.authorization, 'Content-Type': 'application/json' },
    });
    res.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 502;
    res.status(status).json(error.response?.data || { error: 'Error al conectar con user-service' });
  }
});

export default router;
