import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly http = inject(HttpClient);
  private jsonData$: Observable<any> | null = null;

  /**
   * Loads the entire JSON data file once and caches it
   */
  loadData(): Observable<any> {
    if (!this.jsonData$) {
      // In production, load the file from the assets directory
      this.jsonData$ = this.http.get<any>('db.json').pipe(
        shareReplay(1) // Cache the result
      );
    }
    return this.jsonData$;
  }

  /**
   * Gets a specific section from the JSON data
   * @param section The section name to retrieve (e.g., 'hero', 'about', 'stacks')
   */
  getSection<T>(section: string): Observable<T> {
    return this.loadData().pipe(map((data) => data[section] as T));
  }
}
