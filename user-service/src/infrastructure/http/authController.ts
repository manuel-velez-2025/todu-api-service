import { Request, Response } from 'express';
import { AuthService } from '../../application/authService';
import { IOAuthProvider } from '../../application/IOAuthProvider';
import { CreateUserDTO, LoginDTO } from '../../domain/user';

export class AuthController {
  constructor(
    private authService: AuthService,
    private oauthProvider?: IOAuthProvider,
  ) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { nombre, email, password } = req.body;

      if (!nombre || !email || !password) {
        res.status(400).json({ mensaje: 'Nombre, email y password son requeridos' });
        return;
      }

      const dto: CreateUserDTO = { nombre, email, password };
      const result = await this.authService.register(dto);
      res.status(201).json(result);
    } catch (error: any) {
      if (error.message === 'El email ya está registrado') {
        res.status(409).json({ mensaje: error.message });
        return;
      }
      console.error('Error en register:', error);
      res.status(500).json({ mensaje: 'Error al registrar usuario' });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ mensaje: 'Email y password son requeridos' });
        return;
      }

      const dto: LoginDTO = { email, password };
      const result = await this.authService.login(dto);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Credenciales inválidas') {
        res.status(401).json({ mensaje: error.message });
        return;
      }
      console.error('Error en login:', error);
      res.status(500).json({ mensaje: 'Error al iniciar sesión' });
    }
  };

  googleCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.query;

      if (!code || typeof code !== 'string') {
        res.status(400).json({ mensaje: 'Código de autorización requerido' });
        return;
      }

      if (!this.oauthProvider) {
        res.status(501).json({ mensaje: 'OAuth de Google no está configurado' });
        return;
      }

      const googleProfile = await this.oauthProvider.getUserProfile(code);
      const result = await this.authService.loginWithGoogle(googleProfile);

      res.redirect(`http://localhost:5173/auth/callback?token=${result.token}`);
    } catch (error) {
      console.error('Error en googleCallback:', error);
      res.status(500).json({ mensaje: 'Error en autenticación con Google' });
    }
  };
}
