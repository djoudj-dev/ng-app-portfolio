import { computed, inject, Injectable } from '@angular/core';
import { HttpAdapterService } from '@app/core/http/http.adapter';
import { ToastService } from '@app/core/services/toast.service';
import { TokenService } from '@core/auth/service/token.service';
import { AuthResponse, LoginCredentials } from '@core/auth/interface/auth.interface';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';
import { ErrorHandlerService } from '@core/services/error-handler.service';
import { Router } from '@angular/router';

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
    // Informer le serveur pour invalider les tokens
    this.http
      .post<{ message: string }>('/auth/logout', {})
      .pipe(
        tap(() => {
          // Nettoyer les tokens côté client
          this.tokenService.clear();
          this.toast.showSuccess('Déconnexion réussie !');

          // Rediriger vers la page d'accueil
          this.router.navigate(['/']);
        }),
        catchError((error) => {
          console.error('Erreur lors de la déconnexion:', error);

          // Même en cas d'erreur, on nettoie les tokens côté client et on redirige
          this.tokenService.clear();
          this.toast.showSuccess('Déconnexion réussie !');
          this.router.navigate(['/']);

          return of(null);
        }),
        finalize(() => {
          // S'assurer que l'utilisateur est redirigé même si une erreur se produit
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
