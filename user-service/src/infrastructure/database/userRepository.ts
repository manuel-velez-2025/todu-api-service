import { eq, sql, desc } from 'drizzle-orm';
import { db, pool } from './db';
import { usuarios } from './schema';
import { User, AuthProvider } from '../../domain/user';
import { IUserRepository } from '../../application/IUserRepository';


function mapRowToUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    username: row.username as string,
    email: row.email as string,
    passwordHash: row.passwordHash as string | null,
    authProvider: row.authProvider as AuthProvider,
    googleId: row.googleId as string | null,
    fechaNacimiento: row.fechaNacimiento as string | null,
    xpTotal: (row.xpTotal as number) || 0,
    xpActual: (row.xpActual as number) || 0,
    createdAt: row.createdAt as Date | null,
  };
}

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(usuarios).where(eq(usuarios.email, email));
    return result[0] ? mapRowToUser(result[0] as Record<string, unknown>) : null;
  }

  async findById(id: string): Promise<User | null> {
    const result = await db.select().from(usuarios).where(eq(usuarios.id, id));
    return result[0] ? mapRowToUser(result[0] as Record<string, unknown>) : null;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const result = await db.select().from(usuarios).where(eq(usuarios.googleId, googleId));
    return result[0] ? mapRowToUser(result[0] as Record<string, unknown>) : null;
  }

  async create(user: User): Promise<void> {
    await db.insert(usuarios).values({
      id: user.id,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      authProvider: user.authProvider,
      googleId: user.googleId,
      fechaNacimiento: user.fechaNacimiento,
      xpTotal: user.xpTotal ?? 0,
      xpActual: user.xpActual ?? 0,
      createdAt: user.createdAt,
    });
  }

  async update(id: string, data: Partial<User>): Promise<void> {
    const updateData: Record<string, unknown> = {};
    if (data.username !== undefined) updateData['username'] = data.username;
    if (data.email !== undefined) updateData['email'] = data.email;
    if (data.passwordHash !== undefined) updateData['passwordHash'] = data.passwordHash;
    if (data.authProvider !== undefined) updateData['authProvider'] = data.authProvider;
    if (data.googleId !== undefined) updateData['googleId'] = data.googleId;
    if (data.fechaNacimiento !== undefined) updateData['fechaNacimiento'] = data.fechaNacimiento;
    if (data.xpTotal !== undefined) updateData['xpTotal'] = data.xpTotal;
    if (data.xpActual !== undefined) updateData['xpActual'] = data.xpActual;
    if (data.createdAt !== undefined) updateData['createdAt'] = data.createdAt;

    await db.update(usuarios).set(updateData).where(eq(usuarios.id, id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(usuarios).where(eq(usuarios.id, id));
  }

  async addXp(userId: string, xpAmount: number): Promise<void> {
    await db.update(usuarios)
      .set({
        xpTotal: sql`${usuarios.xpTotal} + ${xpAmount}`,
        xpActual: sql`${usuarios.xpActual} + ${xpAmount}`,
      })
      .where(eq(usuarios.id, userId));
  }

  async deductXpAtomically(userId: string, amount: number): Promise<number> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        `SELECT xp_total FROM users WHERE id = $1 FOR UPDATE`,
        [userId],
      );

      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        throw Object.assign(new Error('Usuario no encontrado'), { statusCode: 404 });
      }

      const xpTotal = Number(result.rows[0].xp_total);
      if (xpTotal < amount) {
        await client.query('ROLLBACK');
        throw Object.assign(
          new Error(`XP insuficiente. Tienes ${xpTotal} XP, necesitas ${amount} XP.`),
          { statusCode: 400 },
        );
      }

      const nuevoXpTotal = xpTotal - amount;
      await client.query(
        `UPDATE users SET xp_total = $1, xp_actual = $1 WHERE id = $2`,
        [nuevoXpTotal, userId],
      );

      await client.query('COMMIT');
      return nuevoXpTotal;
    } catch (error) {
      await client.query('ROLLBACK').catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  }

  async getRanking(limit: number = 50): Promise<Array<{ id: string; username: string; xpTotal: number }>> {

    const result = await db
      .select({ id: usuarios.id, username: usuarios.username, xpTotal: usuarios.xpTotal })
      .from(usuarios)
      .orderBy(desc(usuarios.xpTotal))
      .limit(limit);
    return result;
  }
}

