import { IOAuthProvider, GoogleProfile } from '../../application/IOAuthProvider';

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface GoogleUserResponse {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export class GoogleOAuthAdapter implements IOAuthProvider {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.GOOGLE_CLIENT_ID || '';
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    this.redirectUri = process.env.GOOGLE_CALLBACK_URL || '';

    if (!this.clientId || !this.clientSecret) {
      console.warn('Google OAuth no configurado completamente');
    }
  }
  async getUserProfile(code: string): Promise<GoogleProfile> {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw Object.assign(
        new Error('Error al intercambiar código de autorización con Google'),
        { statusCode: 502 },
      );
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json();

    const userResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`,
    );

    if (!userResponse.ok) {
      throw Object.assign(
        new Error('Error al obtener perfil de Google'),
        { statusCode: 502 },
      );
    }

    const user: GoogleUserResponse = await userResponse.json();

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
  async verifyIdToken(idToken: string): Promise<GoogleProfile> {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`,
    );

    if (!response.ok) {
      throw Object.assign(
        new Error('Token de Google inválido o expirado'),
        { statusCode: 401 },
      );
    }

    const payload: Record<string, string> = await response.json();
    if (payload.aud !== this.clientId) {
      throw Object.assign(
        new Error('El token no pertenece a esta aplicación'),
        { statusCode: 401 },
      );
    }

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  }
}
