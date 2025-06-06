import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { HttpAdapterService } from '@core/http/http.adapter';
import { FileUploadResponse, ApiErrorOrNull } from '@core/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class CvService {
  private readonly http = inject(HttpAdapterService);

  private readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  uploadCV(file: File, metadata: Record<string, string> = {}): Observable<FileUploadResponse | ApiErrorOrNull> {
    return this.http.uploadFile<FileUploadResponse>('/cv/upload-file', file, metadata).pipe(
      catchError(() => {
        this._error.set("Erreur lors de l'upload du CV");
        return of(null as ApiErrorOrNull);
      })
    );
  }
}
