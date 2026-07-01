export interface GoogleProfile {
  id: string;
  email: string;
  name: string;
}

export interface IOAuthProvider {
  getUserProfile(code: string): Promise<GoogleProfile>;
  verifyIdToken(idToken: string): Promise<GoogleProfile>;
}
