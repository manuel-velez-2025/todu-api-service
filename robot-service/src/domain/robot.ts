export type RobotEmotion = 'happy' | 'excited' | 'sleepy' | 'worried' | 'evolved';

export type RobotEvent = 'TASK_COMPLETED' | 'LEVEL_UP' | 'STREAK_DAY' | 'TASK_EXPIRED' | 'NO_ACTIVITY';

export type RobotExpression = 'feliz' | 'triste' | 'enojado' | 'sorprendido' | 'neutral';
export type RobotAccesorio = 'sombrero' | 'gafas' | 'corbata' | 'mochila' | 'corona' | 'ninguno';

export interface RobotState {
  id?: string;
  userId: string;
  emotion: RobotEmotion;
  expresion: RobotExpression;
  accesorio: RobotAccesorio;
  nivel: number;
  ultimaActividad: Date;
  fechaCreacion: Date;
}

export interface RobotEventDTO {
  userId: string;
  event: RobotEvent;
  nivel?: number;
}

export interface RobotStateResponse {
  userId: string;
  emotion: RobotEmotion;
  expresion: RobotExpression;
  accesorio: RobotAccesorio;
  nivel: number;
  ultimaActividad: string;
}

export interface UpdateRobotDTO {
  expresion?: RobotExpression;
  accesorio?: RobotAccesorio;
}

export const EVENT_TO_EMOTION: Record<RobotEvent, RobotEmotion> = {
  TASK_COMPLETED: 'happy',
  LEVEL_UP: 'evolved',
  STREAK_DAY: 'excited',
  TASK_EXPIRED: 'worried',
  NO_ACTIVITY: 'sleepy',
};
