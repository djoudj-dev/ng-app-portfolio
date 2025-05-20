import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeComponent } from '@shared/ui/badge/badge.component';
import { BadgeDirective } from '@core/directives/badge.directive';
import { BadgeDatePipe } from '@core/pipes/badge.pipe';

describe('BadgeComponent', () => {
  let component: BadgeComponent;
  let fixture: ComponentFixture<BadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeComponent, BadgeDirective, BadgeDatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have isAvailable computed property', () => {
    expect(component.isAvailable).toBeDefined();
  });

  it('should determine availability based on date', () => {
    // Future date should be available
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    component.badgeDate.set(futureDate);
    expect(component.isAvailable()).toBe(true);

    // Past date should not be available
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 1);
    component.badgeDate.set(pastDate);
    expect(component.isAvailable()).toBe(false);
  });
});
