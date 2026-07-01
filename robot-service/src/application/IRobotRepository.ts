import { RobotState } from '../domain/robot';

export interface IRobotRepository {
  findByUserId(userId: string): Promise<RobotState | null>;
  create(state: RobotState): Promise<void>;
  update(userId: string, data: Partial<RobotState>): Promise<void>;
}
