import { Injectable, signal, inject } from '@angular/core';
import { Observable, catchError, of, tap, map } from 'rxjs';
import { About } from '@feat/admin/about/interface/about.interface';
import { HttpAdapterService } from '@core/http/http.adapter';

@Injectable({ providedIn: 'root' })
export class AboutService {
  private readonly http = inject(HttpAdapterService);

  private readonly _data = signal<About | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly data = this._data.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  load(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<About[]>('/about').subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          const about = res[0];
          this._data.set(about);
        } else {
          this._data.set(null);
        }
        this._loading.set(false);
      },
      error: () => {
        console.error();
        this._error.set("Erreur de chargement depuis l'API");
        this._loading.set(false);
      },
    });
  }

  getAbout(): Observable<About> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<About[]>('/about').pipe(
      tap((aboutItems) => {
        if (aboutItems && aboutItems.length > 0) {
          const about = aboutItems[0];
          this._data.set(about);
        } else {
          this._data.set(null);
        }
        this._loading.set(false);
      }),
      map((aboutItems) => (aboutItems && aboutItems.length > 0 ? aboutItems[0] : (null as unknown as About))),
      catchError(() => {
        console.error();
        this._error.set("Erreur de chargement depuis l'API");
        this._loading.set(false);
        return of(null as unknown as About);
      })
    );
  }

  update(aboutData: About, id?: string): Observable<About> {
    this._loading.set(true);
    this._error.set(null);

    // Use the ID from the current data if available, or from the aboutData, or from the parameter
    const aboutId = id || aboutData.id || this._data()?.id;

    if (!aboutId) {
      console.error();
      this._error.set('Erreur: Aucun ID disponible');
      this._loading.set(false);
      return of(null as unknown as About);
    }

    console.log(`Mise à jour de l'about avec l'ID: ${aboutId}`);
    return this.http.patch<About>(`/about/${aboutId}`, aboutData).pipe(
      tap((updatedAbout) => {
        this._data.set(updatedAbout);
        this._loading.set(false);
      }),
      catchError(() => {
        console.error();
        this._error.set('Erreur lors de la mise à jour');
        this._loading.set(false);
        return of(null as unknown as About);
      })
    );
  }

  create(aboutData: About): Observable<About> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.post<About>('/about', aboutData).pipe(
      tap((newAbout) => {
        this._data.set(newAbout);
        this._loading.set(false);
        console.log('Nouveau about créé avec ID:', newAbout.id);
      }),
      catchError(() => {
        console.error();
        this._error.set('Erreur lors de la création');
        this._loading.set(false);
        return of(null as unknown as About);
      })
    );
  }

  delete(id?: string): Observable<any> {
    this._loading.set(true);
    this._error.set(null);

    // Use the ID from the parameter or from the current data
    const aboutId = id || this._data()?.id;

    if (!aboutId) {
      console.error();
      this._error.set('Erreur: Aucun ID disponible');
      this._loading.set(false);
      return of(null);
    }

    console.log(`Suppression de l'about avec l'ID: ${aboutId}`);
    return this.http.delete<any>(`/about/${aboutId}`).pipe(
      tap(() => {
        this._data.set(null);
        this._loading.set(false);
      }),
      catchError(() => {
        console.error();
        this._error.set('Erreur lors de la suppression');
        this._loading.set(false);
        return of(null);
      })
    );
  }

  resetError(): void {
    this._error.set(null);
  }

  uploadImage(
    file: File,
    metadata: Record<string, string> = {}
  ): Observable<{ filename: string; path: string; mimetype: string }> {
    this._loading.set(true);
    this._error.set(null);

    return this.http
      .uploadFile<{ filename: string; path: string; mimetype: string }>('/about/upload-image', file, metadata)
      .pipe(
        tap(() => {
          this._loading.set(false);
        }),
        catchError(() => {
          console.error();
          this._error.set("Erreur lors de l'upload de l'image");
          this._loading.set(false);
          return of(null as unknown as { filename: string; path: string; mimetype: string });
        })
      );
  }

  getImageInfo(id: string): Observable<{
    filename: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    lastModified: string;
    mimetype: string;
  }> {
    this._loading.set(true);
    this._error.set(null);

    return this.http
      .get<{
        filename: string;
        fileUrl: string;
        fileType: string;
        fileSize: number;
        lastModified: string;
        mimetype: string;
      }>(`/about/${id}/image`)
      .pipe(
        tap(() => {
          this._loading.set(false);
        }),
        catchError((err) => {
          console.error();
          this._error.set("Erreur lors de la récupération des informations de l'image");
          this._loading.set(false);
          throw err;
        })
      );
  }

  updateImage(id: string, file: File, metadata: Record<string, string> = {}): Observable<About> {
    this._loading.set(true);
    this._error.set(null);

    // Vérification de la taille du fichier (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB en octets
    if (file.size > maxSize) {
      this._error.set('Le fichier est trop volumineux. La taille maximale est de 5MB.');
      this._loading.set(false);
      return of(null as unknown as About);
    }

    // Vérification du type de fichier (images)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this._error.set('Format de fichier non supporté. Veuillez utiliser JPEG, PNG, GIF ou WEBP.');
      this._loading.set(false);
      return of(null as unknown as About);
    }

    return this.http.patchFile<About>(`/about/${id}/image`, file, metadata).pipe(
      tap((updatedAbout) => {
        this._data.set(updatedAbout);
        this._loading.set(false);
      }),
      catchError((err) => {
        console.error();

        // Gestion des erreurs spécifiques
        if (err.status === 404) {
          this._error.set('About non trouvé.');
        } else if (err.status === 400) {
          this._error.set(
            'Fichier invalide. Vérifiez le format et la taille (max 5MB, formats: JPEG, PNG, GIF, WEBP).'
          );
        } else {
          this._error.set("Erreur lors de la mise à jour de l'image.");
        }

        this._loading.set(false);
        return of(null as unknown as About);
      })
    );
  }
}
