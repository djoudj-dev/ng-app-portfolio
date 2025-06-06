import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MetricsService } from './service/metrics.service';
import { MetricType } from './interface/metric.interface';
import { VisitCounterComponent } from './components/visit-counter/visit-counter.component';
import { CvUploadComponent } from '@feat/admin/cv-upload/cv-upload.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, VisitCounterComponent, CvUploadComponent],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly metricsService = inject(MetricsService);

  realUserCount = () => this.metricsService.realUserCount();
  botCount = () => this.metricsService.botCount();
  cvClickCount = () => this.metricsService.cvClickCount();

  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor() {
    this.loadMetrics();
  }

  loadMetrics(): void {
    this.isLoading.set(true);
    this.error.set(null);

    let completedRequests = 0;
    const totalRequests = 4;

    const checkAllCompleted = () => {
      completedRequests++;
      if (completedRequests === totalRequests) {
        this.isLoading.set(false);
      }
    };

    this.metricsService.getMetricCount(MetricType.VISIT).subscribe({
      next: () => {
        checkAllCompleted();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.error.set('Failed to load visit count. Please try again later.');
        this.isLoading.set(false);
      },
    });

    // Load bot count
    this.metricsService.getBotMetricCount(MetricType.VISIT).subscribe({
      next: () => {
        checkAllCompleted();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.error.set('Failed to load bot count. Please try again later.');
        this.isLoading.set(false);
      },
    });

    // Load real user count
    this.metricsService.getRealUserMetricCount(MetricType.VISIT).subscribe({
      next: () => {
        checkAllCompleted();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.error.set('Failed to load real user count. Please try again later.');
        this.isLoading.set(false);
      },
    });

    // Load CV click count
    this.metricsService.getCvClickCount().subscribe({
      next: () => {
        checkAllCompleted();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.error.set('Failed to load CV click count. Please try again later.');
        this.isLoading.set(false);
      },
    });
  }

  onCvUploaded(): void {
    this.loadMetrics();
  }
}
