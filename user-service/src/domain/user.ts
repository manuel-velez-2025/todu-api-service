export interface User {
  id: string;
  nombreUsuario: string;
  email: string;
  password: string;
  googleId: string | null;
  fechaCreacion: Date | null;
}

export interface CreateUserDTO {
  nombre: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResult {
  token: string;
  usuario: Omit<User, 'password'>;
}
