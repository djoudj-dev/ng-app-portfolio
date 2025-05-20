import { BadgeDirective } from '@core/directives/badge.directive';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [BadgeDirective],
  template: `<div appBadge [isAvailable]="isAvailable">Test</div>`,
})
class TestComponent {
  isAvailable = true;
}

describe('BadgeDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let divElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    divElement = fixture.debugElement.query(By.css('div')).nativeElement;
    fixture.detectChanges();
  });

  it('should create the directive through the test component', () => {
    const directive = fixture.debugElement.query(By.directive(BadgeDirective));
    expect(directive).toBeTruthy();
  });

  it('should add bg-green-600 class when isAvailable is true', () => {
    component.isAvailable = true;
    fixture.detectChanges();
    expect(divElement.classList.contains('bg-green-600')).toBe(true);
    expect(divElement.classList.contains('bg-red-500')).toBe(false);
  });

  it('should add bg-red-500 class when isAvailable is false', () => {
    component.isAvailable = false;
    fixture.detectChanges();
    expect(divElement.classList.contains('bg-red-500')).toBe(true);
    expect(divElement.classList.contains('bg-green-600')).toBe(false);
  });

  it('should update classes when isAvailable changes', () => {
    // Start with isAvailable = true
    component.isAvailable = true;
    fixture.detectChanges();
    expect(divElement.classList.contains('bg-green-600')).toBe(true);

    // Change to isAvailable = false
    component.isAvailable = false;
    fixture.detectChanges();
    expect(divElement.classList.contains('bg-red-500')).toBe(true);
    expect(divElement.classList.contains('bg-green-600')).toBe(false);

    // Change back to isAvailable = true
    component.isAvailable = true;
    fixture.detectChanges();
    expect(divElement.classList.contains('bg-green-600')).toBe(true);
    expect(divElement.classList.contains('bg-red-500')).toBe(false);
  });
});
