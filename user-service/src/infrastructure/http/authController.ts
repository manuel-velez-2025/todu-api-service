import { Request, Response } from 'express';
import { AuthService } from '../../application/authService';

const authService = new AuthService();

export const registerControlador = async (req: Request, res: Response) => {
    try {
        const { nombre, email, password } = req.body;
        await authService.register(nombre, email, password);
        res.status(201).json({ mensaje: "Usuario creado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al registrar usuario" });
    }
};

export const loginControlador = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ mensaje: "Credenciales inválidas" });
    }
};