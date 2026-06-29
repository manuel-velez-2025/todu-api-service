import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto_para_clase';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ mensaje: "Acceso denegado: Se requiere token" });
    }

    try {
        const verificado = jwt.verify(token, JWT_SECRET);
        (req as any).user = verificado;
        next();
    } catch (error) {
        res.status(401).json({ mensaje: "Token inválido o expirado" });
    }
};