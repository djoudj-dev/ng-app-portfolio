import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MetricsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  trackCvClick(heroId?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/metrics/cv-click`, { heroId });
  }

  getCvClickCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/metrics/cv-clicks/count`);
  }
}
