import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router, NavigationEnd, ActivatedRoute, RouterModule } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let routerEventsSubject: Subject<NavigationEnd>;
  let activatedRouteMock: any;
  let httpClientMock: any;

  beforeEach(() => {
    routerEventsSubject = new Subject<NavigationEnd>();

    const routerMock = {
      events: routerEventsSubject.asObservable(),
      navigate: vi.fn(),
      navigateByUrl: vi.fn(),
      createUrlTree: vi.fn(),
      serializeUrl: vi.fn(),
      url: '',
      isActive: vi.fn().mockReturnValue(false),
    };

    activatedRouteMock = {
      paramMap: new BehaviorSubject({}),
      queryParamMap: new BehaviorSubject({}),
      snapshot: {
        paramMap: {
          get: vi.fn(),
        },
        queryParamMap: {
          get: vi.fn(),
        },
      },
    };

    httpClientMock = {
      get: vi.fn().mockReturnValue(new Subject()),
      post: vi.fn().mockReturnValue(new Subject()),
      put: vi.fn().mockReturnValue(new Subject()),
      delete: vi.fn().mockReturnValue(new Subject()),
    };

    TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule, HttpClientModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: HttpClient, useValue: httpClientMock },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore all the imported components
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isAdminRoute to true when URL starts with /admin', () => {
    // Simulate navigation to admin route
    routerEventsSubject.next(new NavigationEnd(1, '/admin', '/admin'));

    expect(component.isAdminRoute()).toBe(true);
  });

  it('should set isAdminRoute to false when URL does not start with /admin', () => {
    // Simulate navigation to non-admin route
    routerEventsSubject.next(new NavigationEnd(1, '/', '/'));

    expect(component.isAdminRoute()).toBe(false);
  });
});
