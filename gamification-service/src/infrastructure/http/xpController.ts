import { Request, Response } from 'express';
import { XpService } from '../../application/xpService';

export class XpController {
  constructor(private xpService: XpService) {}

  addXp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, xp } = req.body;

      if (!userId || typeof userId !== 'string') {
        res.status(400).json({ error: 'userId es requerido y debe ser string' });
        return;
      }

      if (!xp || typeof xp !== 'number' || xp <= 0) {
        res.status(400).json({ error: 'xp debe ser un número positivo' });
        return;
      }

      const result = await this.xpService.addXp(userId, xp);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error en addXp:', error);
      res.status(500).json({ error: 'Error al agregar XP' });
    }
  };

  getProgress = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId as string;

      if (!userId) {
        res.status(400).json({ error: 'userId es requerido' });
        return;
      }


      const progress = await this.xpService.getProgress(userId);

      if (!progress) {
        res.status(404).json({ error: 'No se encontró progreso para este usuario' });
        return;
      }

      res.status(200).json(progress);
    } catch (error) {
      console.error('Error en getProgress:', error);
      res.status(500).json({ error: 'Error al obtener progreso' });
    }
  };
}
