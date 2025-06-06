/**
 * Interfaces for API responses and errors
 * These interfaces are used to type API responses and errors throughout the application
 * to avoid using 'any' type and improve type safety.
 */

import { HttpErrorResponse } from '@angular/common/http';

/**
 * Base interface for all API responses
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string | string[];
  status?: number;
  success: boolean;
}

/**
 * Interface for file upload responses
 */
export interface FileUploadResponse {
  filename: string;
  path: string;
  mimetype: string;
}

/**
 * Interface for API errors
 */
export interface ApiError {
  message: string | string[];
  status: number;
  error?: string;
}

/**
 * Type for API error or null
 * Used to replace 'any' in error handling
 */
export type ApiErrorOrNull = ApiError | null;

/**
 * Class for handling API errors
 * Extends HttpErrorResponse to provide additional functionality
 */
export class ApiErrorResponse extends HttpErrorResponse {
  constructor(error: HttpErrorResponse) {
    super({
      error: error.error,
      headers: error.headers,
      status: error.status,
      statusText: error.statusText,
      url: error.url || undefined,
    });
  }

  /**
   * Get a user-friendly error message
   */
  getUserMessage(): string {
    if (this.status === 0) {
      return 'Impossible de se connecter au serveur. Veuillez réessayer plus tard.';
    }

    if (this.error?.message) {
      return Array.isArray(this.error.message) ? this.error.message[0] : this.error.message;
    }

    return 'Une erreur est survenue. Veuillez réessayer plus tard.';
  }

  /**
   * Get a user-friendly file upload error message
   */
  getFileUploadErrorMessage(): string {
    if (this.status === 0) {
      return 'Impossible de se connecter au serveur. Veuillez réessayer plus tard.';
    }

    if (this.status === 413) {
      return 'Fichier trop volumineux. Veuillez choisir un fichier plus petit.';
    }

    if (this.status === 415) {
      return 'Format de fichier non supporté. Veuillez choisir un autre format.';
    }

    if (this.error?.message) {
      return Array.isArray(this.error.message) ? this.error.message[0] : this.error.message;
    }

    return 'Erreur lors du téléversement du fichier. Veuillez réessayer.';
  }
}
