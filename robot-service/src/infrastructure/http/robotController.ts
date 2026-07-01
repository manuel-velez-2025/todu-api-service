import { Request, Response } from 'express';
import { RobotService } from '../../application/robotService';
import { RobotEvent } from '../../domain/robot';

const VALID_EVENTS: RobotEvent[] = ['TASK_COMPLETED', 'LEVEL_UP', 'STREAK_DAY', 'TASK_EXPIRED', 'NO_ACTIVITY'];

export class RobotController {
  constructor(private robotService: RobotService) {}

  processEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, event, nivel } = req.body;

      if (!userId || !event) {
        res.status(400).json({ mensaje: 'userId y event son requeridos' });
        return;
      }

      if (!VALID_EVENTS.includes(event)) {
        res.status(400).json({
          mensaje: 'Evento invalido',
          eventosValidos: VALID_EVENTS,
        });
        return;
      }

      const result = await this.robotService.processEvent({ userId, event, nivel });
      res.status(200).json(result);
    } catch (error) {
      console.error('Error en processEvent:', error);
      res.status(500).json({ mensaje: 'Error al procesar evento' });
    }
  };

  getState = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId as string;

      if (!userId) {
        res.status(400).json({ mensaje: 'userId es requerido' });
        return;
      }

      const state = await this.robotService.getState(userId);

      if (!state) {
        res.status(404).json({ mensaje: 'No se encontro estado del robot para este usuario' });
        return;
      }

      res.status(200).json(state);
    } catch (error) {
      console.error('Error en getState:', error);
      res.status(500).json({ mensaje: 'Error al obtener estado del robot' });
    }
  };
}
