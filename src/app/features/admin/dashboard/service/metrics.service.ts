import { inject, Injectable, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpAdapterService } from '@core/http/http.adapter';
import { ErrorHandlerService } from '@core/services/error-handler.service';
import { Metric, MetricCount, MetricMetadata, MetricType } from '../interface/metric.interface';
import { ApiErrorResponse } from '@core/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  private readonly http = inject(HttpAdapterService);
  private readonly errorHandler = inject(ErrorHandlerService);

  private readonly _visitCount = signal<number>(0);
  private readonly _botCount = signal<number>(0);
  private readonly _realUserCount = signal<number>(0);
  private readonly _cvClickCount = signal<number>(0);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly botCount = this._botCount.asReadonly();
  readonly realUserCount = this._realUserCount.asReadonly();
  readonly cvClickCount = this._cvClickCount.asReadonly();
  readonly error = this._error.asReadonly();

  getMetricCount(type?: MetricType): Observable<number> {
    return this.fetchMetricCount('/metrics/count', type, this._visitCount.set, 'load metric count');
  }

  getBotMetricCount(type?: MetricType): Observable<number> {
    return this.fetchMetricCount('/metrics/bots/count', type, this._botCount.set, 'load bot metric count');
  }

  getRealUserMetricCount(type?: MetricType): Observable<number> {
    return this.fetchMetricCount(
      '/metrics/real-users/count',
      type,
      this._realUserCount.set,
      'load real user metric count'
    );
  }

  trackCvClick(heroId?: string): Observable<Metric> {
    return this.postMetric('/metrics/cv-click', { heroId }, this._cvClickCount.set, 'track CV click');
  }

  getCvClickCount(): Observable<number> {
    return this.getMetricCount(MetricType.CV_CLICK);
  }

  private fetchMetricCount(
    path: string,
    type: MetricType | undefined,
    onSuccess: (count: number) => void,
    context: string
  ): Observable<number> {
    this._isLoading.set(true);
    this._error.set(null);

    const url = this.http.buildUrl(path, type ? { type } : undefined);

    return this.http.get<MetricCount>(url).pipe(
      map((res) => res.count),
      tap((count) => {
        onSuccess(count);
        this._isLoading.set(false);
      }),
      tap({
        error: (err: HttpErrorResponse) => {
          this._error.set(this.errorHandler.handleMetricsError(err, context));
          this._isLoading.set(false);
        },
      })
    );
  }

  private postCustomMetric<T>(
    path: string,
    body: Record<string, string | number | boolean | MetricMetadata | undefined>,
    context: string
  ): Observable<T> {
    this._isLoading.set(true);
    this._error.set(null);

    const url = this.http.buildUrl(path);

    return this.http.post<T>(url, body).pipe(
      tap(() => this._isLoading.set(false)),
      tap({
        error: (err: HttpErrorResponse) => {
          new ApiErrorResponse(err);
          this._error.set(this.errorHandler.handleMetricsError(err, context));
          this._isLoading.set(false);
        },
      })
    );
  }

  private postMetric(
    path: string,
    body: Record<string, string | number | boolean | MetricMetadata | undefined>,
    updateSignal: (count: number) => void,
    context: string
  ): Observable<Metric> {
    return this.postCustomMetric<Metric>(path, body, context).pipe(
      tap(() => {
        updateSignal(this._cvClickCount() + 1);
      })
    );
  }
}
