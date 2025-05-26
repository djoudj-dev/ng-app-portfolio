import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { ToastService } from '../../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  const accessToken = authService.getAccessToken();

  const clonedRequest = accessToken
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
        withCredentials: true,
      })
    : req.clone({ withCredentials: true });

  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap((newToken: string) => {
            const retriedRequest = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${newToken}`),
              withCredentials: true,
            });
            return next(retriedRequest);
          }),
          catchError(() => {
            authService.logout();
            toastService.showError('Session expirée, veuillez vous reconnecter.');
            return throwError(() => new Error('Session expired'));
          })
        );
      }
      return throwError(() => error);
    })
  );
};
