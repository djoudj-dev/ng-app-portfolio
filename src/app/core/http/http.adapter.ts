import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpAdapterService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly baseUrl: string = environment.apiUrl;

  private resolveUrl(path: string): string {
    return `${this.baseUrl}${path.startsWith('/') ? path : '/' + path}`;
  }

  constructor() {
    console.log('🌐 Base API URL =', this.baseUrl); // Tu verras directement si c'est localhost ou pas
  }

  get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(this.resolveUrl(path), {
      params,
      withCredentials: true,
    });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.resolveUrl(path), body, {
      withCredentials: true,
    });
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(this.resolveUrl(path), body, {
      withCredentials: true,
    });
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<T>(this.resolveUrl(path), body, {
      withCredentials: true,
    });
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(this.resolveUrl(path), {
      withCredentials: true,
    });
  }

  uploadFile<T>(path: string, file: File, extraData: Record<string, string>): Observable<T> {
    const formData = new FormData();
    formData.append('file', file);
    for (const key in extraData) {
      formData.append(key, extraData[key]);
    }

    return this.http.post<T>(this.resolveUrl(path), formData, {
      withCredentials: true,
    });
  }

  patchFile<T>(path: string, file: File, extraData: Record<string, string> = {}): Observable<T> {
    const formData = new FormData();
    formData.append('file', file);
    for (const key in extraData) {
      formData.append(key, extraData[key]);
    }

    return this.http.patch<T>(this.resolveUrl(path), formData, {
      withCredentials: true,
    });
  }

  buildUrl(path: string, query?: Record<string, string | number | boolean | undefined>): string {
    const base = path.startsWith('/') ? path : '/' + path;
    const queryString = query
      ? '?' +
        Object.entries(query)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
          .join('&')
      : '';
    return `${this.baseUrl}${base}${queryString}`;
  }
}
