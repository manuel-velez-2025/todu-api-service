import { User } from '../domain/user';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  create(user: User): Promise<void>;
  update(id: string, data: Partial<User>): Promise<void>;
  delete(id: string): Promise<void>;
}
