import crypto from 'crypto';
import {
  RobotState,
  RobotEventDTO,
  RobotStateResponse,
  EVENT_TO_EMOTION,
  RobotEmotion,
} from '../domain/robot';
import { IRobotRepository } from './IRobotRepository';

export class RobotService {
  constructor(private repo: IRobotRepository) {}

  async processEvent(dto: RobotEventDTO): Promise<RobotStateResponse> {
    let state = await this.repo.findByUserId(dto.userId);

    if (!state) {
      state = {
        userId: dto.userId,
        emotion: 'sleepy',
        nivel: dto.nivel ?? 1,
        ultimaActividad: new Date(),
        fechaCreacion: new Date(),
      };
    }

    const newEmotion = EVENT_TO_EMOTION[dto.event];
    state.emotion = newEmotion;

    if (dto.nivel && dto.nivel > state.nivel) {
      state.nivel = dto.nivel;
    }

    state.ultimaActividad = new Date();

    if (!(await this.repo.findByUserId(dto.userId))) {
      state.id = crypto.randomUUID();
      await this.repo.create(state);
    } else {
      await this.repo.update(dto.userId, {
        emotion: state.emotion,
        nivel: state.nivel,
        ultimaActividad: state.ultimaActividad,
      });
    }

    return this.buildResponse(state);
  }

  async getState(userId: string): Promise<RobotStateResponse | null> {
    const state = await this.repo.findByUserId(userId);
    if (!state) return null;
    return this.buildResponse(state);
  }

  private buildResponse(state: RobotState): RobotStateResponse {
    return {
      userId: state.userId,
      emotion: state.emotion,
      nivel: state.nivel,
      ultimaActividad: state.ultimaActividad.toISOString(),
    };
  }
}
