import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto_para_clase';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Token no proporcionado',
      mensaje: 'Se requiere un token JWT en el header Authorization: Bearer <token>',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    req.headers['x-user-id'] = decoded.id;
    req.headers['x-user-email'] = decoded.email;
    next();
  } catch (err) {
    res.status(401).json({
      error: 'Token invalido',
      mensaje: 'El token JWT proporcionado no es valido o ha expirado',
    });
  }
}
