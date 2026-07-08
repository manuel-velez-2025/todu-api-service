import { Router, Request, Response } from 'express';
import axios from 'axios';
import http from 'http';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

const TASK_SERVICE = process.env.TASK_SERVICE_URL || 'http://localhost:3002';

router.use(authMiddleware);

router.use(async (req: Request, res: Response) => {
  const targetUrl = `${TASK_SERVICE}${req.originalUrl}`;
  const contentType = req.headers['content-type'] || '';

  const isMultipart = contentType.startsWith('multipart/form-data');
  if (isMultipart) {
    return proxyMultipart(req, res, targetUrl);
  }
  try {
    const response = await axios({
      method: req.method as any,
      url: targetUrl,
      data: req.body,
      headers: {
        'Content-Type': contentType || 'application/json',
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
        mensaje: 'El servicio de tareas no esta disponible en este momento',
      });
    } else {
      res.status(500).json({
        error: 'Error interno del gateway',
        mensaje: error.message,
      });
    }
  }
});

function proxyMultipart(req: Request, res: Response, targetUrl: string): void {
  const url = new URL(targetUrl);

  const options: http.RequestOptions = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname + url.search,
    method: req.method,
    headers: {
      ...req.headers,
      'authorization': req.headers.authorization as string,
      'x-user-id': req.headers['x-user-id'] as string,
      'x-user-email': req.headers['x-user-email'] as string,
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    const chunks: Buffer[] = [];
    proxyRes.on('data', (chunk) => chunks.push(chunk));
    proxyRes.on('end', () => {
      const body = Buffer.concat(chunks);
      try {
        const data = JSON.parse(body.toString());
        res.status(proxyRes.statusCode || 200).json(data);
      } catch {
        res.status(proxyRes.statusCode || 200).send(body);
      }
    });
  });

  proxyReq.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET') {
      res.status(503).json({
        error: 'Servicio no disponible',
        mensaje: 'El servicio de tareas no esta disponible en este momento',
      });
    } else {
      res.status(500).json({
        error: 'Error interno del gateway',
        mensaje: err.message,
      });
    }
  });

  req.pipe(proxyReq);
}

export default router;
