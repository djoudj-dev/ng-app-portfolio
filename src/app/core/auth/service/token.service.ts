import { Injectable, signal } from '@angular/core';
import { AuthState } from '../interface/auth.interface';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly storageKey = 'auth_state';
  private readonly _authState = signal<AuthState>({
    access_token: null,
    refreshToken: null,
    isAuthenticated: false,
    user: null,
  });

  constructor() {
    this.loadAuthState();
  }

  get authState() {
    return this._authState();
  }

  setAuthState(state: AuthState): void {
    this._authState.set(state);
    this.saveAuthState();
  }

  getAccessToken(): string | null {
    return this._authState().access_token;
  }

  getRefreshToken(): string | null {
    return this._authState().refreshToken;
  }

  clear(): void {
    this._authState.set({
      access_token: null,
      refreshToken: null,
      isAuthenticated: false,
      user: null,
    });
    this.saveAuthState();
  }

  private saveAuthState(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this._authState()));
  }

  private loadAuthState(): void {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this._authState.set(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse auth state from localStorage', e);
        this.clear();
      }
    }
  }
}
