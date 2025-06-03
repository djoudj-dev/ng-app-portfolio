import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { HttpAdapterService } from '@core/http/http.adapter';
import { Hero } from '@feat/public/hero/interface/hero.interface';

@Injectable({ providedIn: 'root' })
export class HeroService {
  private readonly http = inject(HttpAdapterService);

  private readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  uploadCV(
    file: File,
    metadata: Record<string, string> = {}
  ): Observable<{ filename: string; path: string; mimetype: string }> {
    return this.http
      .uploadFile<{ filename: string; path: string; mimetype: string }>('/heroes/upload-cv', file, metadata)
      .pipe(
        catchError(() => {
          this._error.set("Erreur lors de l'upload du CV");
          return of(null as any);
        })
      );
  }

  updateCV(id: string, file: File, metadata: Record<string, string> = {}): Observable<Hero> {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (file.size > maxSize) {
      this._error.set('Le fichier est trop volumineux. Max 5MB.');
      return of(null as any);
    }

    if (!allowedTypes.includes(file.type)) {
      this._error.set('Format non supporté. PDF, DOC, DOCX uniquement.');
      return of(null as any);
    }

    return this.http.patchFile<Hero>(`/heroes/${id}/cv`, file, metadata).pipe(
      catchError((err) => {
        if (err.status === 404) {
          this._error.set('Héro non trouvé.');
        } else {
          this._error.set('Erreur lors de la mise à jour du CV.');
        }
        return of(null as any);
      })
    );
  }
}
