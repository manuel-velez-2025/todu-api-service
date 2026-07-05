import bcrypt from 'bcrypt';
import { z } from 'zod';
import { IUserRepository } from './IUserRepository';
import { User } from '../domain/user';

export const updateUsernameSchema = z.object({
  username: z.string().min(2, 'El username debe tener al menos 2 caracteres').max(50, 'El username no puede exceder 50 caracteres'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
});

function stripPassword(user: User): Omit<User, 'passwordHash'> {
  const { passwordHash, ...rest } = user;
  return rest;
}

export class ProfileService {
  constructor(private userRepo: IUserRepository) {}

  async getProfile(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw Object.assign(new Error('Usuario no encontrado'), { statusCode: 404 });
    }
    return stripPassword(user);
  }

  async updateUsername(userId: string, newUsername: string): Promise<Omit<User, 'passwordHash'>> {
    const parsed = updateUsernameSchema.parse({ username: newUsername });

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw Object.assign(new Error('Usuario no encontrado'), { statusCode: 404 });
    }

    await this.userRepo.update(userId, { username: parsed.username });
    user.username = parsed.username;

    return stripPassword(user);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ mensaje: string }> {
    const parsed = changePasswordSchema.parse({ currentPassword, newPassword });

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw Object.assign(new Error('Usuario no encontrado'), { statusCode: 404 });
    }

    if (user.authProvider === 'google' && !user.passwordHash) {
      throw Object.assign(
        new Error('Las cuentas de Google no tienen contraseña. Usa "Olvidé mi contraseña"'),
        { statusCode: 400 },
      );
    }

    const valid = await bcrypt.compare(parsed.currentPassword, user.passwordHash!);
    if (!valid) {
      throw Object.assign(new Error('La contraseña actual es incorrecta'), { statusCode: 401 });
    }

    const newHash = await bcrypt.hash(parsed.newPassword, 10);
    await this.userRepo.update(userId, { passwordHash: newHash });

    return { mensaje: 'Contraseña actualizada exitosamente' };
  }

  async deleteAccount(userId: string): Promise<{ mensaje: string }> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw Object.assign(new Error('Usuario no encontrado'), { statusCode: 404 });
    }

    await this.userRepo.delete(userId);
    return { mensaje: 'Cuenta eliminada exitosamente' };
  }
}
