export type RobotEmotion = 'happy' | 'excited' | 'sleepy' | 'worried' | 'evolved';

export type RobotEvent = 'TASK_COMPLETED' | 'LEVEL_UP' | 'STREAK_DAY' | 'TASK_EXPIRED' | 'NO_ACTIVITY';

export interface RobotState {
  id?: string;
  userId: string;
  emotion: RobotEmotion;
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
  nivel: number;
  ultimaActividad: string;
}

export const EVENT_TO_EMOTION: Record<RobotEvent, RobotEmotion> = {
  TASK_COMPLETED: 'happy',
  LEVEL_UP: 'evolved',
  STREAK_DAY: 'excited',
  TASK_EXPIRED: 'worried',
  NO_ACTIVITY: 'sleepy',
};
