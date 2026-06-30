import { Request, Response } from 'express';
import { GamificationService } from '../../application/gamificationService';

export class GamificationController {
  constructor(private gamificationService: GamificationService) {}

  addXp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, xp } = req.body;

      if (!userId || !xp) {
        res.status(400).json({ mensaje: 'userId y xp son requeridos' });
        return;
      }

      if (typeof xp !== 'number' || xp <= 0) {
        res.status(400).json({ mensaje: 'xp debe ser un número positivo' });
        return;
      }

      const result = await this.gamificationService.addXp({ userId, xp });
      res.status(200).json(result);
    } catch (error) {
      console.error('Error en addXp:', error);
      res.status(500).json({ mensaje: 'Error al agregar XP' });
    }
  };

  getProgress = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId as string;

      if (!userId) {
        res.status(400).json({ mensaje: 'userId es requerido' });
        return;
      }

      const progress = await this.gamificationService.getProgress(userId);

      if (!progress) {
        res.status(404).json({ mensaje: 'No se encontró progreso para este usuario' });
        return;
      }

      res.status(200).json(progress);
    } catch (error) {
      console.error('Error en getProgress:', error);
      res.status(500).json({ mensaje: 'Error al obtener progreso' });
    }
  };
}
