import '@analogjs/vitest-angular/setup-zone';

// Set NODE_ENV to 'test' for environment detection
if (typeof process !== 'undefined') {
  process.env.NODE_ENV = 'test';
}

import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

// Initialize the Angular testing environment
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

// Configure TestBed with common providers for all tests
TestBed.configureTestingModule({
  imports: [HttpClientTestingModule],
});
