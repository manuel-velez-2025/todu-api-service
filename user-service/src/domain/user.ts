export type AuthProvider = 'email' | 'google';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string | null;
  authProvider: AuthProvider;
  googleId: string | null;
  createdAt: Date | null;
}

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface GoogleAuthDTO {
  googleToken: string;
}

export interface AuthResult {
  token: string;
  user: Omit<User, 'passwordHash'>;
}
