import { Request, Response } from 'express';
import { RobotService } from '../../application/robotService';
import { RobotEvent, RobotExpression, RobotAccesorio } from '../../domain/robot';

const VALID_EVENTS: RobotEvent[] = ['TASK_COMPLETED', 'LEVEL_UP', 'STREAK_DAY', 'TASK_EXPIRED', 'NO_ACTIVITY'];

const VALID_EXPRESSIONS: RobotExpression[] = ['feliz', 'triste', 'enojado', 'sorprendido', 'neutral'];
const VALID_ACCESORIOS: RobotAccesorio[] = ['sombrero', 'gafas', 'corbata', 'mochila', 'corona', 'ninguno'];

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

  getMyRobot = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.headers['x-user-id'] as string;

      if (!userId) {
        res.status(401).json({ mensaje: 'Usuario no autenticado' });
        return;
      }

      const state = await this.robotService.getState(userId);

      if (!state) {
        res.status(200).json({
          userId,
          emotion: 'sleepy',
          expresion: 'neutral',
          accesorio: 'ninguno',
          nivel: 1,
          ultimaActividad: new Date().toISOString(),
        });
        return;
      }

      res.status(200).json(state);
    } catch (error) {
      console.error('Error en getMyRobot:', error);
      res.status(500).json({ mensaje: 'Error al obtener el robot' });
    }
  };
  updateRobot = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.headers['x-user-id'] as string;

      if (!userId) {
        res.status(401).json({ mensaje: 'Usuario no autenticado' });
        return;
      }

      const { expresion, accesorio } = req.body;

      if (!expresion && !accesorio) {
        res.status(400).json({ mensaje: 'Debe enviar al menos expresion o accesorio' });
        return;
      }

      if (expresion && !VALID_EXPRESSIONS.includes(expresion)) {
        res.status(400).json({
          mensaje: 'Expresion invalida',
          expresionesValidas: VALID_EXPRESSIONS,
        });
        return;
      }

      if (accesorio && !VALID_ACCESORIOS.includes(accesorio)) {
        res.status(400).json({
          mensaje: 'Accesorio invalido',
          accesoriosValidos: VALID_ACCESORIOS,
        });
        return;
      }

      const result = await this.robotService.updateRobot(userId, { expresion, accesorio });

      if (!result) {
        res.status(404).json({ mensaje: 'No se encontro estado del robot. Crea uno usando un evento primero.' });
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Error en updateRobot:', error);
      res.status(500).json({ mensaje: 'Error al actualizar el robot' });
    }
  };
}
