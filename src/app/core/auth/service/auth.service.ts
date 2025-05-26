import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpAdapterService } from '@core/http/http.adapter';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AuthResponse, AuthState, LoginCredentials } from '../interface/auth.interface';
import { ToastService } from '@core/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authStateKey = 'auth_state';
  private readonly http = inject(HttpAdapterService);
  private readonly toastService = inject(ToastService);

  private readonly _authState = signal<AuthState>({
    access_token: null,
    refreshToken: null,
    isAuthenticated: false,
    user: null,
  });

  readonly isAuthenticated = computed(() => this._authState().isAuthenticated);
  readonly user = computed(() => this._authState().user);

  constructor() {
    this.loadAuthState();
  }

  login(credentials: LoginCredentials): Observable<boolean> {
    return this.http.post<AuthResponse>('/auth/login', credentials).pipe(
      tap((response) => {
        const newState: AuthState = {
          access_token: response.access_token,
          refreshToken: response.refreshToken || null,
          isAuthenticated: true,
          user: response.user
            ? {
                id: response.user.id,
                email: response.user.email || null,
                role: response.user.role || null,
              }
            : null,
        };

        this._authState.set(newState);
        this.saveAuthState();
        this.toastService.showSuccess('Connexion réussie !');
      }),
      map(() => true),
      catchError((error) => {
        console.error('Login failed:', error);
        let errorMessage = 'Échec de la connexion. Veuillez réessayer.';

        if (error.status === 401) {
          errorMessage = 'Identifiants invalides. Veuillez réessayer.';
        } else if (error.status === 0) {
          errorMessage = 'Impossible de se connecter au serveur. Veuillez réessayer plus tard.';
        } else if (error.error && error.error.message) {
          // Use server error message if available
          errorMessage = Array.isArray(error.error.message)
            ? error.error.message[0] // NestJS validation errors are often arrays
            : error.error.message;
        }

        this.toastService.showError(errorMessage);
        return of(false);
      })
    );
  }

  logout(): void {
    // Reset auth state
    this._authState.set({
      access_token: null,
      refreshToken: null,
      isAuthenticated: false,
      user: null,
    });

    this.saveAuthState();
    this.toastService.showSuccess('Déconnexion réussie !');

    // Optional: Call logout endpoint on the server
    // this.http.post('/auth/logout', {}).subscribe();
  }

  getAccessToken(): string | null {
    return this._authState().access_token;
  }

  refreshToken(): Observable<string> {
    const refreshToken = this._authState().refreshToken;

    if (!refreshToken) {
      return of('');
    }

    return this.http.post<AuthResponse>('/auth/refresh', { refreshToken }).pipe(
      tap((response) => {
        const currentState = this._authState();

        this._authState.set({
          ...currentState,
          access_token: response.access_token,
          refreshToken: response.refreshToken || currentState.refreshToken,
        });

        this.saveAuthState();
      }),
      map((response) => response.access_token),
      catchError(() => {
        this.logout();
        return of('');
      })
    );
  }

  private saveAuthState(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.authStateKey, JSON.stringify(this._authState()));
    }
  }

  private loadAuthState(): void {
    if (typeof localStorage !== 'undefined') {
      const savedState = localStorage.getItem(this.authStateKey);

      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState) as AuthState;
          this._authState.set(parsedState);
        } catch (error) {
          console.error('Failed to parse auth state:', error);
          this.logout();
        }
      }
    }
  }
}
