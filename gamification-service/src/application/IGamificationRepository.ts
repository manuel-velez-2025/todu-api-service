import { UserProgress } from '../domain/gamification';

export interface IGamificationRepository {
  findByUserId(userId: string): Promise<UserProgress | null>;
  create(progress: UserProgress): Promise<void>;
  update(userId: string, data: Partial<UserProgress>): Promise<void>;
}
