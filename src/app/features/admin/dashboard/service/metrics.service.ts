import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { HttpAdapterService } from '@core/http/http.adapter';
import { Metric, MetricCount, MetricType } from '../interface/metric.interface';

type MetricPeriods = {
  day: Metric[];
  week: Metric[];
  month: Metric[];
  year: Metric[];
};
@Injectable({ providedIn: 'root' })
export class MetricsService {
  private readonly http = inject(HttpAdapterService);

  // State signals
  private readonly _visitCount = signal<number>(0);
  private readonly _metrics = signal<Metric[]>([]);
  private readonly _botMetrics = signal<Metric[]>([]);
  private readonly _realUserMetrics = signal<Metric[]>([]);
  private readonly _botCount = signal<number>(0);
  private readonly _realUserCount = signal<number>(0);
  private readonly _cvClickCount = signal<number>(0);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Public readonly signals
  readonly visitCount = this._visitCount.asReadonly();
  readonly metrics = this._metrics.asReadonly();
  readonly botMetrics = this._botMetrics.asReadonly();
  readonly realUserMetrics = this._realUserMetrics.asReadonly();
  readonly botCount = this._botCount.asReadonly();
  readonly realUserCount = this._realUserCount.asReadonly();
  readonly cvClickCount = this._cvClickCount.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals
  readonly metricsByPeriod = computed<MetricPeriods>(() => {
    const metrics = this._metrics();
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    return {
      day: metrics.filter((m) => new Date(m.createdAt) >= dayAgo),
      week: metrics.filter((m) => new Date(m.createdAt) >= weekAgo),
      month: metrics.filter((m) => new Date(m.createdAt) >= monthAgo),
      year: metrics.filter((m) => new Date(m.createdAt) >= yearAgo),
    };
  });

  readonly botMetricsByPeriod = computed<MetricPeriods>(() => {
    const metrics = this._botMetrics();
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    return {
      day: metrics.filter((m) => new Date(m.createdAt) >= dayAgo),
      week: metrics.filter((m) => new Date(m.createdAt) >= weekAgo),
      month: metrics.filter((m) => new Date(m.createdAt) >= monthAgo),
      year: metrics.filter((m) => new Date(m.createdAt) >= yearAgo),
    };
  });

  readonly realUserMetricsByPeriod = computed<MetricPeriods>(() => {
    const metrics = this._realUserMetrics();
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    return {
      day: metrics.filter((m) => new Date(m.createdAt) >= dayAgo),
      week: metrics.filter((m) => new Date(m.createdAt) >= weekAgo),
      month: metrics.filter((m) => new Date(m.createdAt) >= monthAgo),
      year: metrics.filter((m) => new Date(m.createdAt) >= yearAgo),
    };
  });

  // Get all metrics with optional type filter
  getMetrics(type?: MetricType): Observable<Metric[]> {
    this._isLoading.set(true);
    this._error.set(null);

    const params = type ? `?type=${type}` : '';
    return this.http.get<Metric[]>(`/metrics${params}`).pipe(
      tap((metrics) => {
        this._metrics.set(metrics);
        this._isLoading.set(false);
      }),
      tap({
        error: () => {
          console.error();
          this._error.set('Failed to load metrics. Please try again later.');
          this._isLoading.set(false);
        },
      })
    );
  }

  // Get metrics by path with optional type filter
  getMetricsByPath(path: string, type?: MetricType): Observable<Metric[]> {
    this._isLoading.set(true);
    this._error.set(null);

    const params = type ? `?path=${path}&type=${type}` : `?path=${path}`;
    return this.http.get<Metric[]>(`/metrics/path${params}`).pipe(
      tap(() => this._isLoading.set(false)),
      tap({
        error: (err) => {
          console.error();
          this._error.set('Failed to load metrics by path. Please try again later.');
          this._isLoading.set(false);
        },
      })
    );
  }

  // Get metrics by user with optional type filter
  getMetricsByUser(userId: string, type?: MetricType): Observable<Metric[]> {
    this._isLoading.set(true);
    this._error.set(null);

    const params = type ? `?userId=${userId}&type=${type}` : `?userId=${userId}`;
    return this.http.get<Metric[]>(`/metrics/user${params}`).pipe(
      tap(() => this._isLoading.set(false)),
      tap({
        error: (err) => {
          console.error();
          this._error.set('Failed to load metrics by user. Please try again later.');
          this._isLoading.set(false);
        },
      })
    );
  }

  // Get metric count with optional type filter
  getMetricCount(type?: MetricType): Observable<number> {
    this._isLoading.set(true);
    this._error.set(null);

    const params = type ? `?type=${type}` : '';
    return this.http.get<MetricCount>(`/metrics/count${params}`).pipe(
      map((response) => response.count),
      tap((count) => {
        this._visitCount.set(count);
        this._isLoading.set(false);
      }),
      tap({
        error: (err) => {
          console.error();
          this._error.set('Failed to load metric count. Please try again later.');
          this._isLoading.set(false);
        },
      })
    );
  }

  // Track a visit
  trackVisit(
    path: string,
    userId?: string,
    userAgent?: string,
    ipAddress?: string,
    metadata?: Record<string, any>
  ): Observable<Metric> {
    return this.http.post<Metric>('/metrics/visit', {
      path,
      userId,
      userAgent,
      ipAddress,
      metadata,
    });
  }

  // Get metrics grouped by time periods (day, week, month, year)
  getMetricsByPeriod(type: MetricType = MetricType.VISIT): Observable<MetricPeriods> {
    return this.getMetrics(type).pipe(map(() => this.metricsByPeriod()));
  }

  // Bot metrics methods
  getBotMetrics(type?: MetricType): Observable<Metric[]> {
    this._isLoading.set(true);
    this._error.set(null);

    const params = type ? `?type=${type}` : '';
    return this.http.get<Metric[]>(`/metrics/bots${params}`).pipe(
      tap((metrics) => {
        this._botMetrics.set(metrics);
        this._isLoading.set(false);
      }),
      tap({
        error: (err) => {
          console.error();
          this._error.set('Failed to load bot metrics. Please try again later.');
          this._isLoading.set(false);
        },
      })
    );
  }

  getBotMetricsByPath(path: string, type?: MetricType): Observable<Metric[]> {
    this._isLoading.set(true);
    this._error.set(null);

    const params = type ? `?path=${path}&type=${type}` : `?path=${path}`;
    return this.http.get<Metric[]>(`/metrics/bots/path${params}`).pipe(
      tap(() => this._isLoading.set(false)),
      tap({
        error: (err) => {
          console.error();
          this._error.set('Failed to load bot metrics by path. Please try again later.');
          this._isLoading.set(false);
        },
      })
    );
  }

  getBotMetricCount(type?: MetricType): Observable<number> {
    this._isLoading.set(true);
    this._error.set(null);

    const params = type ? `?type=${type}` : '';
    return this.http.get<MetricCount>(`/metrics/bots/count${params}`).pipe(
      map((response) => response.count),
      tap((count) => {
        this._botCount.set(count);
        this._isLoading.set(false);
      }),
      tap({
        error: (err) => {
          console.error();
          this._error.set('Failed to load bot metric count. Please try again later.');
          this._isLoading.set(false);
        },
      })
    );
  }

  getBotMetricsByPeriod(type: MetricType = MetricType.VISIT): Observable<MetricPeriods> {
    return this.getBotMetrics(type).pipe(map(() => this.botMetricsByPeriod()));
  }

  // Real user metrics methods
  getRealUserMetrics(type?: MetricType): Observable<Metric[]> {
    this._isLoading.set(true);
    this._error.set(null);

    const params = type ? `?type=${type}` : '';
    return this.http.get<Metric[]>(`/metrics/real-users${params}`).pipe(
      tap((metrics) => {
        this._realUserMetrics.set(metrics);
        this._isLoading.set(false);
      }),
      tap({
        error: (err) => {
          console.error();
          this._error.set('Failed to load real user metrics. Please try again later.');
          this._isLoading.set(false);
        },
      })
    );
  }

  getRealUserMetricsByPath(path: string, type?: MetricType): Observable<Metric[]> {
    this._isLoading.set(true);
    this._error.set(null);

    const params = type ? `?path=${path}&type=${type}` : `?path=${path}`;
    return this.http.get<Metric[]>(`/metrics/real-users/path${params}`).pipe(
      tap(() => this._isLoading.set(false)),
      tap({
        error: (err) => {
          console.error();
          this._error.set('Failed to load real user metrics by path. Please try again later.');
          this._isLoading.set(false);
        },
      })
    );
  }

  getRealUserMetricCount(type?: MetricType): Observable<number> {
    this._isLoading.set(true);
    this._error.set(null);

    const params = type ? `?type=${type}` : '';
    return this.http.get<MetricCount>(`/metrics/real-users/count${params}`).pipe(
      map((response) => response.count),
      tap((count) => {
        this._realUserCount.set(count);
        this._isLoading.set(false);
      }),
      tap({
        error: (err) => {
          console.error();
          this._error.set('Failed to load real user metric count. Please try again later.');
          this._isLoading.set(false);
        },
      })
    );
  }

  getRealUserMetricsByPeriod(type: MetricType = MetricType.VISIT): Observable<MetricPeriods> {
    return this.getRealUserMetrics(type).pipe(map(() => this.realUserMetricsByPeriod()));
  }

  // CV Click metrics methods
  getCvClickCount(): Observable<number> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.get<MetricCount>(`/metrics/count?type=${MetricType.CV_CLICK}`).pipe(
      map((response) => response.count),
      tap((count) => {
        this._cvClickCount.set(count);
        this._isLoading.set(false);
      }),
      tap({
        error: (err) => {
          console.error();
          this._error.set('Failed to load CV click count. Please try again later.');
          this._isLoading.set(false);
        },
      })
    );
  }
}
