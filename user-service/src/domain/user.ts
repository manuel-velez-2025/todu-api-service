export type AuthProvider = 'email' | 'google';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string | null;
  authProvider: AuthProvider;
  googleId: string | null;
  fechaNacimiento: string | null;
  createdAt: Date | null;
  xpTotal: number;
  xpActual: number;
}

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  fechaNacimiento: string;
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

export type InventoryItemId = 'halloween' | 'bunny' | 'ninja' | 'robot' | 'princess' | 'pirate' | 'superhero' | 'wizard';

export interface InventoryItem {
  id: string;
  userId: string;
  itemId: InventoryItemId;
  isEquipped: boolean;
  createdAt: Date;
}



