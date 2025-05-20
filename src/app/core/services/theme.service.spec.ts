import { TestBed } from '@angular/core/testing';
import { ThemeService } from '@core/services/theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let localStorageSpy: jest.SpyInstance;
  let documentSpy: jest.SpyInstance;

  beforeEach(() => {
    // Mock localStorage
    localStorageSpy = vi.spyOn(Storage.prototype, 'getItem');
    vi.spyOn(Storage.prototype, 'setItem');

    // Mock document.documentElement
    documentSpy = vi.spyOn(document.documentElement, 'setAttribute');

    TestBed.configureTestingModule({
      providers: [ThemeService],
    });
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with light theme by default', () => {
    localStorageSpy.mockReturnValue(null);
    service.loadTheme();
    expect(service.isDarkMode()).toBe(false);
    expect(service.theme).toBe('light');
  });

  it('should load dark theme from localStorage', () => {
    localStorageSpy.mockReturnValue('dark');
    service.loadTheme();
    expect(service.isDarkMode()).toBe(true);
    expect(service.theme).toBe('dark');
  });

  it('should toggle theme', () => {
    // Start with light theme
    service.setTheme('light');
    expect(service.isDarkMode()).toBe(false);

    // Toggle to dark
    service.toggleTheme();
    expect(service.isDarkMode()).toBe(true);
    expect(documentSpy).toHaveBeenCalledWith('data-theme', 'dark');

    // Toggle back to light
    service.toggleTheme();
    expect(service.isDarkMode()).toBe(false);
    expect(documentSpy).toHaveBeenCalledWith('data-theme', 'light');
  });
});
