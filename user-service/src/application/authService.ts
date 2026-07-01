import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';
import { IUserRepository } from './IUserRepository';
import { IOAuthProvider } from './IOAuthProvider';
import { User, AuthResult, AuthProvider } from '../domain/user';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto_para_clase';

export const registerSchema = z.object({
  username: z.string().min(2, 'El username debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const googleAuthSchema = z.object({
  googleToken: z.string().min(1, 'Token de Google requerido'),
});

function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    JWT_SECRET,
    { expiresIn: '24h' },
  );
}

function stripPassword(user: User): Omit<User, 'passwordHash'> {
  const { passwordHash, ...rest } = user;
  return rest;
}

export class AuthService {
  constructor(
    private userRepo: IUserRepository,
    private oauthAdapter?: IOAuthProvider,
  ) {}

  async register(dto: z.infer<typeof registerSchema>): Promise<AuthResult> {
    const parsed = registerSchema.parse(dto);

    const existing = await this.userRepo.findByEmail(parsed.email);
    if (existing) {
      throw Object.assign(new Error('El email ya está registrado'), { statusCode: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.password, 10);

    const newUser: User = {
      id: crypto.randomUUID(),
      username: parsed.username,
      email: parsed.email,
      passwordHash,
      authProvider: 'email' as AuthProvider,
      googleId: null,
      createdAt: new Date(),
    };

    await this.userRepo.create(newUser);

    const token = generateToken(newUser);
    return { token, user: stripPassword(newUser) };
  }

  async login(dto: z.infer<typeof loginSchema>): Promise<AuthResult> {
    const parsed = loginSchema.parse(dto);

    const user = await this.userRepo.findByEmail(parsed.email);
    if (!user || !user.passwordHash) {
      throw Object.assign(new Error('Credenciales inválidas'), { statusCode: 401 });
    }

    const valid = await bcrypt.compare(parsed.password, user.passwordHash);
    if (!valid) {
      throw Object.assign(new Error('Credenciales inválidas'), { statusCode: 401 });
    }

    const token = generateToken(user);
    return { token, user: stripPassword(user) };
  }

  async loginWithGoogle(googleToken: string): Promise<AuthResult> {
    if (!this.oauthAdapter) {
      throw Object.assign(new Error('OAuth de Google no configurado'), { statusCode: 501 });
    }

    const profile = await this.oauthAdapter.verifyIdToken(googleToken);

    let user = await this.userRepo.findByGoogleId(profile.id);

    if (!user) {
      user = await this.userRepo.findByEmail(profile.email);

      if (user) {
        await this.userRepo.update(user.id, {
          googleId: profile.id,
          authProvider: 'google' as AuthProvider,
        });
        user.googleId = profile.id;
        user.authProvider = 'google';
      } else {
        const newUser: User = {
          id: crypto.randomUUID(),
          username: profile.name,
          email: profile.email,
          passwordHash: null,
          authProvider: 'google' as AuthProvider,
          googleId: profile.id,
          createdAt: new Date(),
        };
        await this.userRepo.create(newUser);
        user = newUser;
      }
    }

    const token = generateToken(user);
    return { token, user: stripPassword(user) };
  }
  
  async loginWithGoogleCode(code: string): Promise<AuthResult> {
    if (!this.oauthAdapter) {
      throw Object.assign(new Error('OAuth de Google no configurado'), { statusCode: 501 });
    }

    const profile = await this.oauthAdapter.getUserProfile(code);

    let user = await this.userRepo.findByGoogleId(profile.id);

    if (!user) {
      user = await this.userRepo.findByEmail(profile.email);

      if (user) {
        await this.userRepo.update(user.id, {
          googleId: profile.id,
          authProvider: 'google' as AuthProvider,
        });
        user.googleId = profile.id;
        user.authProvider = 'google';
      } else {
        const newUser: User = {
          id: crypto.randomUUID(),
          username: profile.name,
          email: profile.email,
          passwordHash: null,
          authProvider: 'google' as AuthProvider,
          googleId: profile.id,
          createdAt: new Date(),
        };
        await this.userRepo.create(newUser);
        user = newUser;
      }
    }

    const token = generateToken(user);
    return { token, user: stripPassword(user) };
  }
}
