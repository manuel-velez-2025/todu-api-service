import { Request, Response } from 'express';
import { AuthService, registerSchema, loginSchema, googleAuthSchema } from '../../application/authService';

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = registerSchema.parse(req.body);
      const result = await this.authService.register(parsed);
      res.status(201).json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ mensaje: 'Datos inválidos', errores: error.issues || error.errors });
        return;
      }
      if (error.statusCode === 409) {
        res.status(409).json({ mensaje: error.message });
        return;
      }
      console.error('Error en register:', error);
      res.status(500).json({ mensaje: 'Error al registrar usuario' });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = loginSchema.parse(req.body);
      const result = await this.authService.login(parsed);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ mensaje: 'Datos inválidos', errores: error.issues || error.errors });
        return;
      }
      if (error.statusCode === 401) {
        res.status(401).json({ mensaje: error.message });
        return;
      }
      console.error('Error en login:', error);
      res.status(500).json({ mensaje: 'Error al iniciar sesión' });
    }
  };

  googleAuth = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = googleAuthSchema.parse(req.body);
      const result = await this.authService.loginWithGoogle(parsed.googleToken);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ mensaje: 'Datos inválidos', errores: error.issues || error.errors });
        return;
      }
      if (error.statusCode === 501) {
        res.status(501).json({ mensaje: error.message });
        return;
      }
      if (error.statusCode === 401) {
        res.status(401).json({ mensaje: error.message });
        return;
      }
      console.error('Error en Google Auth:', error);
      res.status(500).json({ mensaje: 'Error en autenticación con Google' });
    }
  };

  googleCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.query;

      if (!code || typeof code !== 'string') {
        res.status(400).json({ mensaje: 'Código de autorización requerido' });
        return;
      }

      const result = await this.authService.loginWithGoogleCode(code);
      res.redirect(`http://localhost:5173/auth/callback?token=${result.token}`);
    } catch (error: any) {
      if (error.statusCode === 502) {
        res.status(502).json({ mensaje: error.message });
        return;
      }
      if (error.statusCode === 401) {
        res.status(401).json({ mensaje: error.message });
        return;
      }
      console.error('Error en googleCallback:', error);
      res.status(500).json({ mensaje: 'Error en autenticación con Google' });
    }
  };
}
