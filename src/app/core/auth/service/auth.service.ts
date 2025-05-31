import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';

import { HttpAdapterService } from '@app/core/http/http.adapter';
import { ToastService } from '@app/core/services/toast.service';
import { TokenService } from '@core/auth/service/token.service';
import { ErrorHandlerService } from '@core/services/error-handler.service';
import { AuthResponse, LoginCredentials } from '@core/auth/interface/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpAdapterService);
  private readonly toast = inject(ToastService);
  private readonly tokenService = inject(TokenService);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly router = inject(Router);

  readonly isAuthenticated = computed(() => this.tokenService.authState.isAuthenticated);

  readonly user = computed(() => this.tokenService.authState.user);

  login(credentials: LoginCredentials): Observable<boolean> {
    return this.http.post<AuthResponse>('/auth/login', credentials).pipe(
      tap((response) => {
        this.tokenService.setAuthState({
          access_token: response.access_token,
          refreshToken: response.refreshToken ?? null,
          isAuthenticated: true,
          user: response.user
            ? {
                id: response.user.id ?? null,
                email: response.user.email ?? null,
                role: response.user.role ?? null,
              }
            : null,
        });
        this.toast.showSuccess('Connexion réussie !');
      }),
      map(() => true),
      catchError((error) => {
        const msg = this.errorHandler.handleAuthError(error);
        this.toast.showError(msg);
        return of(false);
      })
    );
  }

  logout(): void {
    this.http
      .post<{ message: string }>('/auth/logout', {})
      .pipe(
        tap(() => {
          this.tokenService.clear();
          this.toast.showSuccess('Déconnexion réussie !');
          this.router.navigate(['/']);
        }),
        catchError(() => {
          // Même si la requête échoue, on nettoie localement
          this.tokenService.clear();
          this.router.navigate(['/']);
          return of(null);
        }),
        finalize(() => {
          // Redirection de secours si sur une route protégée
          if (this.router.url.includes('/admin')) {
            this.router.navigate(['/']);
          }
        })
      )
      .subscribe();
  }

  getAccessToken(): string | null {
    return this.tokenService.getAccessToken();
  }

  refreshToken(): Observable<string> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) return of('');

    return this.http.post<AuthResponse>('/auth/refresh', { refreshToken }).pipe(
      tap((response) => {
        const current = this.tokenService.authState;
        this.tokenService.setAuthState({
          ...current,
          access_token: response.access_token,
          refreshToken: response.refreshToken ?? current.refreshToken,
        });
      }),
      map((response) => response.access_token),
      catchError(() => {
        this.logout();
        return of('');
      })
    );
  }
}
