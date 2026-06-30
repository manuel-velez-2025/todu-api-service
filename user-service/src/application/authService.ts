import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { IUserRepository } from './IUserRepository';
import { User, CreateUserDTO, LoginDTO, AuthResult } from '../domain/user';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto_para_clase';

export class AuthService {
  constructor(private userRepo: IUserRepository) {}

  async register(dto: CreateUserDTO): Promise<{ mensaje: string }> {
    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser: User = {
      id: crypto.randomUUID(),
      nombreUsuario: dto.nombre,
      email: dto.email,
      password: hashedPassword,
      googleId: null,
      fechaCreacion: new Date(),
    };

    await this.userRepo.create(newUser);

    return { mensaje: 'Usuario registrado con éxito' };
  }

  async login(dto: LoginDTO): Promise<AuthResult> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, nombre: user.nombreUsuario },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password, ...usuario } = user;
    return { token, usuario };
  }

  async loginWithGoogle(googleProfile: { id: string; email: string; name: string }): Promise<AuthResult> {
    let user = await this.userRepo.findByGoogleId(googleProfile.id);

    if (!user) {
      user = await this.userRepo.findByEmail(googleProfile.email);

      if (user) {
        await this.userRepo.update(user.id, { googleId: googleProfile.id });
      } else {
        const newUser: User = {
          id: crypto.randomUUID(),
          nombreUsuario: googleProfile.name,
          email: googleProfile.email,
          password: '',
          googleId: googleProfile.id,
          fechaCreacion: new Date(),
        };
        await this.userRepo.create(newUser);
        user = newUser;
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, nombre: user.nombreUsuario },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password, ...usuario } = user;
    return { token, usuario };
  }
}
