import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsService } from './service/metrics.service';
import { Metric, MetricType } from './interface/metric.interface';
import { VisitCounterComponent } from './components/visit-counter/visit-counter.component';
import { MetricsGraphComponent } from './components/metrics-graph/metrics-graph.component';

type PeriodType = 'day' | 'week' | 'month' | 'year';
type VisitorType = 'all' | 'bots' | 'real-users';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, VisitCounterComponent, MetricsGraphComponent],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly metricsService = inject(MetricsService);

  visitCount = () => this.metricsService.visitCount();
  realUserCount = () => this.metricsService.realUserCount();
  botCount = () => this.metricsService.botCount();
  cvClickCount = () => this.metricsService.cvClickCount();

  selectedPeriod = signal<PeriodType>('day');
  selectedVisitorType = signal<VisitorType>('all');
  metrics = signal<{ [key: string]: Metric[] }>({
    day: [],
    week: [],
    month: [],
    year: [],
  });

  botMetrics = signal<{ [key: string]: Metric[] }>({
    day: [],
    week: [],
    month: [],
    year: [],
  });

  realUserMetrics = signal<{ [key: string]: Metric[] }>({
    day: [],
    week: [],
    month: [],
    year: [],
  });

  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor() {
    this.loadMetrics();
  }

  loadMetrics(): void {
    this.isLoading.set(true);
    this.error.set(null);

    // Load visit count
    this.metricsService.getMetricCount(MetricType.VISIT).subscribe({
      error: () => {
        console.error('Failed to load visit count');
        this.error.set('Failed to load visit count. Please try again later.');
        this.isLoading.set(false);
      },
    });

    // Load bot count
    this.metricsService.getBotMetricCount(MetricType.VISIT).subscribe({
      error: () => {
        console.error('Failed to load bot count');
        this.error.set('Failed to load bot count. Please try again later.');
        this.isLoading.set(false);
      },
    });

    // Load real user count
    this.metricsService.getRealUserMetricCount(MetricType.VISIT).subscribe({
      error: () => {
        console.error('Failed to load real user count');
        this.error.set('Failed to load real user count. Please try again later.');
        this.isLoading.set(false);
      },
    });

    // Load CV click count
    this.metricsService.getCvClickCount().subscribe({
      error: () => {
        console.error('Failed to load CV click count');
        this.error.set('Failed to load CV click count. Please try again later.');
        this.isLoading.set(false);
      },
    });

    // Load metrics by period
    this.metricsService.getMetricsByPeriod(MetricType.VISIT).subscribe({
      next: (data) => {
        this.metrics.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        console.error('Failed to load metrics');
        this.error.set('Failed to load metrics. Please try again later.');
        this.isLoading.set(false);
      },
    });

    // Load bot metrics by period
    this.metricsService.getBotMetricsByPeriod(MetricType.VISIT).subscribe({
      next: (data) => {
        this.botMetrics.set(data);
      },
      error: () => {
        console.error('Failed to load bot metrics');
        this.error.set('Failed to load bot metrics. Please try again later.');
        this.isLoading.set(false);
      },
    });

    // Load real user metrics by period
    this.metricsService.getRealUserMetricsByPeriod(MetricType.VISIT).subscribe({
      next: (data) => {
        this.realUserMetrics.set(data);
      },
      error: () => {
        console.error('Failed to load real user metrics');
        this.error.set('Failed to load real user metrics. Please try again later.');
        this.isLoading.set(false);
      },
    });
  }

  changePeriod(period: PeriodType): void {
    this.selectedPeriod.set(period);
  }

  changeVisitorType(type: VisitorType): void {
    this.selectedVisitorType.set(type);
  }

  getVisitCount(): number {
    return this.visitCount();
  }

  getRealUserCount(): number {
    return this.realUserCount();
  }

  getBotCount(): number {
    return this.botCount();
  }

  getCvClickCount(): number {
    return this.cvClickCount();
  }

  getCurrentMetrics(): { [key: string]: Metric[] } {
    switch (this.selectedVisitorType()) {
      case 'bots':
        return this.botMetrics();
      case 'real-users':
        return this.realUserMetrics();
      default:
        return this.metrics();
    }
  }
}
