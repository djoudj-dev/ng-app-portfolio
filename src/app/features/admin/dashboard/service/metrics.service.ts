import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpAdapterService } from '@core/http/http.adapter';
import { ErrorHandlerService } from '@core/services/error-handler.service';
import { Metric, MetricCount, MetricMetadata, MetricType } from '../interface/metric.interface';
import { ApiErrorResponse } from '@core/models/api-response.model';

type MetricPeriods = {
  day: Metric[];
  week: Metric[];
  month: Metric[];
  year: Metric[];
};

@Injectable({ providedIn: 'root' })
export class MetricsService {
  private readonly http = inject(HttpAdapterService);
  private readonly errorHandler = inject(ErrorHandlerService);

  private readonly _metrics = signal<Metric[]>([]);
  private readonly _botMetrics = signal<Metric[]>([]);
  private readonly _realUserMetrics = signal<Metric[]>([]);
  private readonly _visitCount = signal<number>(0);
  private readonly _botCount = signal<number>(0);
  private readonly _realUserCount = signal<number>(0);
  private readonly _cvClickCount = signal<number>(0);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly metrics = this._metrics.asReadonly();
  readonly botMetrics = this._botMetrics.asReadonly();
  readonly realUserMetrics = this._realUserMetrics.asReadonly();
  readonly visitCount = this._visitCount.asReadonly();
  readonly botCount = this._botCount.asReadonly();
  readonly realUserCount = this._realUserCount.asReadonly();
  readonly cvClickCount = this._cvClickCount.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly metricsByPeriod = computed(() => this.computeMetricsByPeriod(this._metrics()));
  readonly botMetricsByPeriod = computed(() => this.computeMetricsByPeriod(this._botMetrics()));
  readonly realUserMetricsByPeriod = computed(() => this.computeMetricsByPeriod(this._realUserMetrics()));

  getMetrics(type?: MetricType): Observable<Metric[]> {
    return this.fetchMetrics(`/metrics`, { type }, this._metrics.set, 'load metrics');
  }

  getMetricsByPath(path: string, type?: MetricType): Observable<Metric[]> {
    return this.fetchMetrics(`/metrics/path`, { path, type }, () => {}, 'load metrics by path');
  }

  getMetricsByUser(userId: string, type?: MetricType): Observable<Metric[]> {
    return this.fetchMetrics(`/metrics/user`, { userId, type }, () => {}, 'load metrics by user');
  }

  getMetricCount(type?: MetricType): Observable<number> {
    return this.fetchMetricCount(`/metrics/count`, type, this._visitCount.set, 'load metric count');
  }

  getMetricsByPeriod(type: MetricType = MetricType.VISIT): Observable<MetricPeriods> {
    return this.getMetrics(type).pipe(map(() => this.metricsByPeriod()));
  }

  getBotMetrics(type?: MetricType): Observable<Metric[]> {
    return this.fetchMetrics(`/metrics/bots`, { type }, this._botMetrics.set, 'load bot metrics');
  }

  getBotMetricsByPath(path: string, type?: MetricType): Observable<Metric[]> {
    return this.fetchMetrics(`/metrics/bots/path`, { path, type }, () => {}, 'load bot metrics by path');
  }

  getBotMetricCount(type?: MetricType): Observable<number> {
    return this.fetchMetricCount(`/metrics/bots/count`, type, this._botCount.set, 'load bot metric count');
  }

  getBotMetricsByPeriod(type: MetricType = MetricType.VISIT): Observable<MetricPeriods> {
    return this.getBotMetrics(type).pipe(map(() => this.botMetricsByPeriod()));
  }

  getRealUserMetrics(type?: MetricType): Observable<Metric[]> {
    return this.fetchMetrics(`/metrics/real-users`, { type }, this._realUserMetrics.set, 'load real user metrics');
  }

  getRealUserMetricsByPath(path: string, type?: MetricType): Observable<Metric[]> {
    return this.fetchMetrics(`/metrics/real-users/path`, { path, type }, () => {}, 'load real user metrics by path');
  }

  getRealUserMetricCount(type?: MetricType): Observable<number> {
    return this.fetchMetricCount(
      `/metrics/real-users/count`,
      type,
      this._realUserCount.set,
      'load real user metric count'
    );
  }

  getRealUserMetricsByPeriod(type: MetricType = MetricType.VISIT): Observable<MetricPeriods> {
    return this.getRealUserMetrics(type).pipe(map(() => this.realUserMetricsByPeriod()));
  }

  trackCvClick(heroId?: string): Observable<Metric> {
    return this.postMetric(`/metrics/cv-click`, { heroId }, this._cvClickCount.set, 'track CV click');
  }

  getCvClickCount(): Observable<number> {
    return this.getMetricCount(MetricType.CV_CLICK);
  }

  trackVisit(
    path: string,
    userId?: string,
    userAgent?: string,
    ipAddress?: string,
    metadata?: MetricMetadata
  ): Observable<Metric | { skipped: boolean; reason: string }> {
    return this.postCustomMetric('/metrics/visit', { path, userId, userAgent, ipAddress, metadata }, 'track visit');
  }

  createMetric(createMetricDto: {
    type: MetricType;
    path: string;
    userId?: string;
    userAgent?: string;
    ipAddress?: string;
    metadata?: MetricMetadata;
  }): Observable<Metric> {
    return this.postCustomMetric('/metrics', createMetricDto, 'create metric');
  }

  private computeMetricsByPeriod(metrics: Metric[]): MetricPeriods {
    const now = new Date();
    const subtractDays = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const dayAgo = subtractDays(1);
    const weekAgo = subtractDays(7);
    const monthAgo = subtractDays(30);
    const yearAgo = subtractDays(365);

    return {
      day: metrics.filter((m) => new Date(m.createdAt) >= dayAgo),
      week: metrics.filter((m) => new Date(m.createdAt) >= weekAgo),
      month: metrics.filter((m) => new Date(m.createdAt) >= monthAgo),
      year: metrics.filter((m) => new Date(m.createdAt) >= yearAgo),
    };
  }

  private fetchMetrics(
    baseUrl: string,
    params: Record<string, string | MetricType | undefined>,
    onSuccess: (data: Metric[]) => void,
    context: string
  ): Observable<Metric[]> {
    this._isLoading.set(true);
    this._error.set(null);

    const query = Object.entries(params)
      .filter(([, v]) => {
        return v !== undefined;
      })
      .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
      .join('&');

    const url = query ? `${baseUrl}?${query}` : baseUrl;

    return this.http.get<Metric[]>(url).pipe(
      tap((data) => {
        onSuccess(data);
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

  private fetchMetricCount(
    baseUrl: string,
    type: MetricType | undefined,
    onSuccess: (count: number) => void,
    context: string
  ): Observable<number> {
    this._isLoading.set(true);
    this._error.set(null);

    const url = type ? `${baseUrl}?type=${type}` : baseUrl;

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
    url: string,
    body: Record<string, string | number | boolean | MetricMetadata | undefined>,
    context: string
  ): Observable<T> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.post<T>(url, body).pipe(
      tap(() => this._isLoading.set(false)),
      tap({
        error: (err: HttpErrorResponse) => {
          // Use the ApiErrorResponse class for better error handling
          new ApiErrorResponse(err);
          this._error.set(this.errorHandler.handleMetricsError(err, context));
          this._isLoading.set(false);
        },
      })
    );
  }

  private postMetric(
    url: string,
    body: Record<string, string | number | boolean | MetricMetadata | undefined>,
    updateSignal: (count: number) => void,
    context: string
  ): Observable<Metric> {
    return this.postCustomMetric<Metric>(url, body, context).pipe(
      tap(() => {
        updateSignal(this._cvClickCount() + 1);
      })
    );
  }
}
