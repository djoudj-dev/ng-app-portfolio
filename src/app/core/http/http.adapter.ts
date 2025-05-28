import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpAdapterService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly baseUrl: string = environment.apiUrl;

  get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`, {
      params,
      withCredentials: true,
    });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body, {
      withCredentials: true,
    });
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body, {
      withCredentials: true,
    });
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body, {
      withCredentials: true,
    });
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`, {
      withCredentials: true,
    });
  }

  /**
   * Gets a file from the local assets without prepending the API base URL
   * @param path The path to the local file
   */
  getLocal<T>(path: string): Observable<T> {
    return this.http.get<T>(path, {
      withCredentials: true,
    });
  }

  uploadFile<T>(path: string, file: File, extraData: Record<string, string>): Observable<T> {
    const formData = new FormData();
    formData.append('file', file);
    for (const key in extraData) {
      formData.append(key, extraData[key]);
    }

    return this.http.post<T>(`${this.baseUrl}${path}`, formData, {
      withCredentials: true,
    });
  }

  /**
   * Uploads a file using PATCH method
   * @param path The API endpoint path
   * @param file The file to upload
   * @param extraData Additional data to include in the form
   * @returns An Observable of the response
   */
  patchFile<T>(path: string, file: File, extraData: Record<string, string> = {}): Observable<T> {
    const formData = new FormData();
    formData.append('file', file);
    for (const key in extraData) {
      formData.append(key, extraData[key]);
    }

    return this.http.patch<T>(`${this.baseUrl}${path}`, formData, {
      withCredentials: true,
    });
  }
}
