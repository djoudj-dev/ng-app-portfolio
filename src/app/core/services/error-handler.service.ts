import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  /**
   * Handles authentication errors and returns appropriate error messages
   */
  handleAuthError(error: HttpErrorResponse): string {
    let message = 'Une erreur est survenue. Veuillez réessayer plus tard.';

    if (error.status === 401) {
      message = 'Identifiants invalides. Veuillez réessayer.';
    } else if (error.status === 0) {
      message = 'Impossible de se connecter au serveur. Veuillez réessayer plus tard.';
    } else if (error.error?.message) {
      message = Array.isArray(error.error.message) ? error.error.message[0] : error.error.message;
    }

    console.error();
    return message;
  }

  /**
   * Handles general API errors and returns appropriate error messages
   */
  handleApiError(error: HttpErrorResponse): string {
    let message = 'Une erreur est survenue. Veuillez réessayer plus tard.';

    if (error.status === 0) {
      message = 'Impossible de se connecter au serveur. Veuillez réessayer plus tard.';
    } else if (error.error?.message) {
      message = Array.isArray(error.error.message) ? error.error.message[0] : error.error.message;
    }

    console.error();
    return message;
  }
}
