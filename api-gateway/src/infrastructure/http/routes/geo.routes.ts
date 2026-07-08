import { Router, Request, Response } from 'express';
import axios from 'axios';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkLevel } from '../middlewares/checkLevel.middleware';

const router = Router();

const GEO_SERVICE = process.env.GEO_SERVICE_URL || 'http://localhost:3005';

router.use(authMiddleware);
router.use(checkLevel(2));

router.use(async (req: Request, res: Response) => {
  try {
    const targetUrl = `${GEO_SERVICE}${req.originalUrl}`;
    console.log(`Connecting to: ${GEO_SERVICE}${req.originalUrl}`);
    const response = await axios({
      method: req.method as any,
      url: targetUrl,
      data: req.body,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'authorization': req.headers['authorization'] as string,
        'x-user-id': req.headers['x-user-id'] as string,
        'x-user-email': req.headers['x-user-email'] as string,
      },
      validateStatus: () => true,
    });

    res.status(response.status).json(response.data);
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ECONNRESET') {
      res.status(503).json({
        error: 'Servicio no disponible',
        mensaje: 'El servicio de geolocalizacion no esta disponible en este momento',
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
