import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroComponent } from './hero.component';
import { ScrollService } from '@core/services/scroll.service';
import { FileUrlService } from '@core/services/file-url.service';
import { MetricsService } from '@feat/admin/dashboard/service/metrics.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ActivatedRoute, Router } from '@angular/router';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;
  let scrollServiceMock: { scrollToSection: any };
  let fileUrlServiceMock: { getFileUrl: any };
  let metricsServiceMock: { trackCvClick: any };
  let routerMock: { navigate: any };
  let activatedRouteMock: { paramMap: any; queryParamMap: any };

  beforeEach(() => {
    scrollServiceMock = {
      scrollToSection: vi.fn(),
    };
    fileUrlServiceMock = {
      getFileUrl: vi.fn(),
    };
    metricsServiceMock = {
      trackCvClick: vi.fn(),
    };
    routerMock = {
      navigate: vi.fn(),
    };
    activatedRouteMock = {
      paramMap: new BehaviorSubject({}),
      queryParamMap: new BehaviorSubject({}),
    };

    TestBed.configureTestingModule({
      imports: [HeroComponent],
      providers: [
        { provide: ScrollService, useValue: scrollServiceMock },
        { provide: FileUrlService, useValue: fileUrlServiceMock },
        { provide: MetricsService, useValue: metricsServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore NgOptimizedImage and ButtonComponent
    });

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call scrollToSection when scrollToSection is called', async () => {
    scrollServiceMock.scrollToSection.mockResolvedValue(undefined);

    await component.scrollToSection('about');

    expect(scrollServiceMock.scrollToSection).toHaveBeenCalledWith('about');
  });

  it('should download CV when downloadCV is called', () => {
    const windowSpy = vi.spyOn(window, 'open').mockImplementation(vi.fn());
    metricsServiceMock.trackCvClick.mockReturnValue(of({}));
    fileUrlServiceMock.getFileUrl.mockReturnValue('test-url');

    component.downloadCV();

    expect(metricsServiceMock.trackCvClick).toHaveBeenCalledWith('static-hero');
    expect(fileUrlServiceMock.getFileUrl).toHaveBeenCalledWith(component.cvPath);
    expect(windowSpy).toHaveBeenCalledWith('test-url', '_blank');
  });

  it('should handle error when trackCvClick fails', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());
    const windowSpy = vi.spyOn(window, 'open').mockImplementation(vi.fn());
    const error = new Error('Test error');

    metricsServiceMock.trackCvClick.mockReturnValue(throwError(() => error));

    component.downloadCV();

    expect(metricsServiceMock.trackCvClick).toHaveBeenCalledWith('static-hero');
    expect(consoleSpy).toHaveBeenCalledWith(error);
    expect(windowSpy).not.toHaveBeenCalled();
  });
});
