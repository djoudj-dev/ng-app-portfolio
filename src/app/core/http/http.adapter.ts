import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ResourceSignals, createResourceSignal } from '../utils/signal-utils';

@Injectable({ providedIn: 'root' })
export class HttpAdapterService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly baseUrl: string = environment.apiUrl;

  private resolveUrl(path: string): string {
    return `${this.baseUrl}${path.startsWith('/') ? path : '/' + path}`;
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

  getBinary(path: string): Observable<Blob> {
    return this.http.get(this.resolveUrl(path), {
      responseType: 'blob',
      withCredentials: true,
    });
  }

  // Signal-based alternatives

  getWithSignal<T>(path: string, params?: HttpParams): ResourceSignals<T> {
    return createResourceSignal(() => this.get<T>(path, params));
  }

  postWithSignal<T>(path: string, body: unknown): ResourceSignals<T> {
    return createResourceSignal(() => this.post<T>(path, body));
  }

  putWithSignal<T>(path: string, body: unknown): ResourceSignals<T> {
    return createResourceSignal(() => this.put<T>(path, body));
  }

  patchWithSignal<T>(path: string, body: unknown): ResourceSignals<T> {
    return createResourceSignal(() => this.patch<T>(path, body));
  }

  deleteWithSignal<T>(path: string): ResourceSignals<T> {
    return createResourceSignal(() => this.delete<T>(path));
  }

  uploadFileWithSignal<T>(path: string, file: File, extraData: Record<string, string>): ResourceSignals<T> {
    return createResourceSignal(() => this.uploadFile<T>(path, file, extraData));
  }

  patchFileWithSignal<T>(path: string, file: File, extraData: Record<string, string> = {}): ResourceSignals<T> {
    return createResourceSignal(() => this.patchFile<T>(path, file, extraData));
  }

  getBinaryWithSignal(path: string): ResourceSignals<Blob> {
    return createResourceSignal(() => this.getBinary(path));
  }
}
