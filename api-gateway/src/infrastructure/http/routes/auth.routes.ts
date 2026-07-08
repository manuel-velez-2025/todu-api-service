import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

const USER_SERVICE = process.env.USER_SERVICE_URL || 'http://localhost:3001';

router.use(async (req: Request, res: Response) => {
  try {
    const targetUrl = `${USER_SERVICE}${req.originalUrl}`;
    console.log(`Connecting to: ${USER_SERVICE}${req.originalUrl}`);
    const response = await axios({
      method: req.method as any,
      url: targetUrl,
      data: req.body,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        ...(req.headers['authorization'] ? { authorization: req.headers['authorization'] } : {}),
      },
      validateStatus: () => true,
    });

    res.status(response.status).json(response.data);
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ECONNRESET') {
      res.status(503).json({
        error: 'Servicio no disponible',
        mensaje: 'El servicio de usuario no esta disponible en este momento',
      });
    } else {
      res.status(500).json({
        error: 'Error interno del gateway',
        mensaje: error.message,
      });
    }
  }
});

export default router;
