import { Injectable, signal, inject } from '@angular/core';
import { Observable, catchError, of, tap, map } from 'rxjs';
import { Hero } from '@feat/admin/hero/interface/hero.interface';
import { HttpAdapterService } from '@core/http/http.adapter';

@Injectable({ providedIn: 'root' })
export class HeroService {
  private readonly http = inject(HttpAdapterService);

  private readonly _data = signal<Hero | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly data = this._data.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  load(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<Hero[]>('/heroes').subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          const hero = res[0];
          this._data.set(hero);
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

  getHero(): Observable<Hero> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<Hero[]>('/heroes').pipe(
      tap((heroes) => {
        if (heroes && heroes.length > 0) {
          const hero = heroes[0];
          this._data.set(hero);
        } else {
          this._data.set(null);
        }
        this._loading.set(false);
      }),
      map((heroes) => (heroes && heroes.length > 0 ? heroes[0] : (null as unknown as Hero))),
      catchError(() => {
        console.error();
        this._error.set("Erreur de chargement depuis l'API");
        this._loading.set(false);
        return of(null as unknown as Hero);
      })
    );
  }

  update(heroData: Hero, id?: string): Observable<Hero> {
    this._loading.set(true);
    this._error.set(null);

    // Use the ID from the current data if available, or from the heroData, or from the parameter
    const heroId = id || heroData.id || this._data()?.id;

    if (!heroId) {
      console.error();
      this._error.set('Erreur: Aucun ID de héros disponible');
      this._loading.set(false);
      return of(null as unknown as Hero);
    }

    console.log(`Mise à jour du héros avec l'ID: ${heroId}`);
    return this.http.patch<Hero>(`/heroes/${heroId}`, heroData).pipe(
      tap((updatedHero) => {
        this._data.set(updatedHero);
        this._loading.set(false);
      }),
      catchError(() => {
        console.error();
        this._error.set('Erreur lors de la mise à jour');
        this._loading.set(false);
        // Return empty observable to prevent error propagation
        return of(null as unknown as Hero);
      })
    );
  }

  create(heroData: Hero): Observable<Hero> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.post<Hero>('/heroes', heroData).pipe(
      tap((newHero) => {
        this._data.set(newHero);
        this._loading.set(false);
        console.log('Nouveau héros créé avec ID:', newHero.id);
      }),
      catchError(() => {
        console.error();
        this._error.set('Erreur lors de la création');
        this._loading.set(false);
        // Return empty observable to prevent error propagation
        return of(null as unknown as Hero);
      })
    );
  }

  delete(id?: string): Observable<any> {
    this._loading.set(true);
    this._error.set(null);

    // Use the ID from the parameter or from the current data
    const heroId = id || this._data()?.id;

    if (!heroId) {
      console.error();
      this._error.set('Erreur: Aucun ID de héros disponible');
      this._loading.set(false);
      return of(null);
    }

    console.log(`Suppression du héros avec l'ID: ${heroId}`);
    return this.http.delete<any>(`/heroes/${heroId}`).pipe(
      tap(() => {
        this._data.set(null);
        this._loading.set(false);
      }),
      catchError(() => {
        console.error();
        this._error.set('Erreur lors de la suppression');
        this._loading.set(false);
        // Return empty observable to prevent error propagation
        return of(null);
      })
    );
  }

  resetError(): void {
    this._error.set(null);
  }

  uploadCV(
    file: File,
    metadata: Record<string, string> = {}
  ): Observable<{ filename: string; path: string; mimetype: string }> {
    this._loading.set(true);
    this._error.set(null);

    return this.http
      .uploadFile<{ filename: string; path: string; mimetype: string }>('/heroes/upload-cv', file, metadata)
      .pipe(
        tap(() => {
          this._loading.set(false);
        }),
        catchError(() => {
          console.error();
          this._error.set("Erreur lors de l'upload du CV");
          this._loading.set(false);
          // Return empty observable to prevent error propagation
          return of(null as unknown as { filename: string; path: string; mimetype: string });
        })
      );
  }

  getCvInfo(id: string): Observable<{
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
      }>(`/heroes/${id}/cv`)
      .pipe(
        tap(() => {
          this._loading.set(false);
        }),
        catchError((err) => {
          console.error();
          this._error.set('Erreur lors de la récupération des informations du CV');
          this._loading.set(false);
          throw err; // Propager l'erreur pour permettre la gestion par l'appelant
        })
      );
  }

  /**
   * Met à jour le CV d'un héro spécifique
   * @param id L'identifiant unique du héro
   * @param file Le nouveau fichier CV
   * @param metadata Métadonnées additionnelles (optionnel)
   * @returns Un Observable contenant l'objet héro mis à jour
   */
  updateCV(id: string, file: File, metadata: Record<string, string> = {}): Observable<Hero> {
    this._loading.set(true);
    this._error.set(null);

    // Vérification de la taille du fichier (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB en octets
    if (file.size > maxSize) {
      this._error.set('Le fichier est trop volumineux. La taille maximale est de 5MB.');
      this._loading.set(false);
      return of(null as unknown as Hero);
    }

    // Vérification du type de fichier (PDF, DOC, DOCX)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      this._error.set('Format de fichier non supporté. Veuillez utiliser PDF, DOC ou DOCX.');
      this._loading.set(false);
      return of(null as unknown as Hero);
    }

    return this.http.patchFile<Hero>(`/heroes/${id}/cv`, file, metadata).pipe(
      tap((updatedHero) => {
        this._data.set(updatedHero);
        this._loading.set(false);
      }),
      catchError((err) => {
        console.error();

        // Gestion des erreurs spécifiques
        if (err.status === 404) {
          this._error.set('Héro non trouvé.');
        } else if (err.status === 400) {
          this._error.set('Fichier invalide. Vérifiez le format et la taille (max 5MB, formats: PDF, DOC, DOCX).');
        } else {
          this._error.set('Erreur lors de la mise à jour du CV.');
        }

        this._loading.set(false);
        return of(null as unknown as Hero);
      })
    );
  }
}
