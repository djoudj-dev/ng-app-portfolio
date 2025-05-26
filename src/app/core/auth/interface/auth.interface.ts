export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  access_token: string; // Changé de accessToken à access_token pour correspondre à la réponse du backend
  refreshToken?: string;
  expiresIn?: number;
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

export interface AuthState {
  access_token: string | null; // Changé de accessToken à access_token pour correspondre à la réponse du backend
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: {
    id: string | null;
    email: string | null;
    role: string | null;
  } | null;
}
