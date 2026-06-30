import { eq } from 'drizzle-orm';
import { db } from './db';
import { usuarios } from './schema';
import { User } from '../../domain/user';
import { IUserRepository } from '../../application/IUserRepository';

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(usuarios).where(eq(usuarios.email, email));
    return result[0] || null;
  }

  async findById(id: string): Promise<User | null> {
    const result = await db.select().from(usuarios).where(eq(usuarios.id, id));
    return result[0] || null;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const result = await db.select().from(usuarios).where(eq(usuarios.googleId, googleId));
    return result[0] || null;
  }

  async create(user: User): Promise<void> {
    await db.insert(usuarios).values(user);
  }

  async update(id: string, data: Partial<User>): Promise<void> {
    await db.update(usuarios).set(data).where(eq(usuarios.id, id));
  }
}
