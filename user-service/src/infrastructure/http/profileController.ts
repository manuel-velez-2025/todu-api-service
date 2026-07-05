import { Request, Response } from 'express';
import { ProfileService, updateUsernameSchema, changePasswordSchema } from '../../application/profileService';

export class ProfileController {
  constructor(private profileService: ProfileService) {}

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const profile = await this.profileService.getProfile(userId);
      res.status(200).json(profile);
    } catch (error: any) {
      if (error.statusCode === 404) {
        res.status(404).json({ mensaje: error.message });
        return;
      }
      console.error('Error en getProfile:', error);
      res.status(500).json({ mensaje: 'Error al obtener perfil' });
    }
  };

  updateUsername = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const parsed = updateUsernameSchema.parse(req.body);
      const profile = await this.profileService.updateUsername(userId, parsed.username);
      res.status(200).json({ mensaje: 'Nombre de usuario actualizado', user: profile });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ mensaje: 'Datos inválidos', errores: error.issues || error.errors });
        return;
      }
      if (error.statusCode === 404) {
        res.status(404).json({ mensaje: error.message });
        return;
      }
      console.error('Error en updateUsername:', error);
      res.status(500).json({ mensaje: 'Error al actualizar nombre de usuario' });
    }
  };

  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const parsed = changePasswordSchema.parse(req.body);
      const result = await this.profileService.changePassword(userId, parsed.currentPassword, parsed.newPassword);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ mensaje: 'Datos inválidos', errores: error.issues || error.errors });
        return;
      }
      if (error.statusCode === 404) {
        res.status(404).json({ mensaje: error.message });
        return;
      }
      if (error.statusCode === 401) {
        res.status(401).json({ mensaje: error.message });
        return;
      }
      if (error.statusCode === 400) {
        res.status(400).json({ mensaje: error.message });
        return;
      }
      console.error('Error en changePassword:', error);
      res.status(500).json({ mensaje: 'Error al cambiar contraseña' });
    }
  };

  deleteAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await this.profileService.deleteAccount(userId);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.statusCode === 404) {
        res.status(404).json({ mensaje: error.message });
        return;
      }
      console.error('Error en deleteAccount:', error);
      res.status(500).json({ mensaje: 'Error al eliminar cuenta' });
    }
  };
}
