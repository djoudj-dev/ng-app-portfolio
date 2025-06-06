import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BehaviorSubject, Subject } from 'rxjs';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(() => {
    routerMock = {
      navigate: vi.fn(),
      navigateByUrl: vi.fn(),
      events: new Subject(),
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

    TestBed.configureTestingModule({
      imports: [AdminComponent, RouterModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore router-outlet and other router directives
    });

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
