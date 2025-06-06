import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectListComponent } from './project-list.component';
import { ProjectService } from '../service/project.service';
import { FileUrlService } from '@core/services/file-url.service';
import { BehaviorSubject, of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ActivatedRoute, Router } from '@angular/router';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  let projectServiceMock: {
    getProjects: any;
    getCategories: any;
    deleteProject: any;
    projects: any;
  };
  let fileUrlServiceMock: { getFileUrl: any };
  let routerMock: { navigate: any };
  let activatedRouteMock: { paramMap: any; queryParamMap: any };

  beforeEach(() => {
    projectServiceMock = {
      getProjects: vi.fn(),
      getCategories: vi.fn(),
      deleteProject: vi.fn(),
      projects: vi.fn().mockReturnValue([]),
    };

    fileUrlServiceMock = {
      getFileUrl: vi.fn(),
    };

    routerMock = {
      navigate: vi.fn(),
    };

    activatedRouteMock = {
      paramMap: new BehaviorSubject({}),
      queryParamMap: new BehaviorSubject({}),
    };

    TestBed.configureTestingModule({
      imports: [ProjectListComponent],
      providers: [
        { provide: ProjectService, useValue: projectServiceMock },
        { provide: FileUrlService, useValue: fileUrlServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getProjects and getCategories on init', () => {
    projectServiceMock.getProjects.mockReturnValue(of([]));
    projectServiceMock.getCategories.mockReturnValue(of([]));

    component.ngOnInit();

    expect(projectServiceMock.getProjects).toHaveBeenCalled();
    expect(projectServiceMock.getCategories).toHaveBeenCalled();
  });

  it('should call deleteProject when confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    projectServiceMock.deleteProject.mockReturnValue(of(void 0));

    component.deleteProject('test-id');

    expect(projectServiceMock.deleteProject).toHaveBeenCalledWith('test-id');
  });

  it('should not call deleteProject when not confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.deleteProject('test-id');

    expect(projectServiceMock.deleteProject).not.toHaveBeenCalled();
  });

  it('should get image URL from fileUrlService', () => {
    fileUrlServiceMock.getFileUrl.mockReturnValue('test-url');

    const result = component.getImageUrl('test-path');

    expect(fileUrlServiceMock.getFileUrl).toHaveBeenCalledWith('test-path');
    expect(result).toBe('test-url');
  });
});
