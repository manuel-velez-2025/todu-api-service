import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const profileRouter = Router();

function proxyToUser(req: Request, res: Response): void {
  const path = req.path;
  const targetUrl = `${USER_SERVICE_URL}${path}`;
  console.log(`Connecting to: ${USER_SERVICE_URL}${path}`);

  const fetchOptions: RequestInit = {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': req.headers.authorization || '',
    },
  };

  if (req.method !== 'GET' && req.method !== 'DELETE') {
    fetchOptions.body = JSON.stringify(req.body);
  }

  fetch(targetUrl, fetchOptions)
    .then(async (response) => {
      const data = await response.json();
      res.status(response.status).json(data);
    })
    .catch((err) => {
      console.error(`Error proxy a user-service [${req.method} ${path}]:`, err.message);
      res.status(502).json({ error: 'Error de comunicación con user-service' });
    });
}

profileRouter.get('/perfil', authMiddleware, proxyToUser);
profileRouter.put('/perfil/username', authMiddleware, proxyToUser);
profileRouter.put('/perfil/password', authMiddleware, proxyToUser);
profileRouter.delete('/perfil', authMiddleware, proxyToUser);

export default profileRouter;
