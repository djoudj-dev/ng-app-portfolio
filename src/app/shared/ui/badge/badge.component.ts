import { Component, computed, signal } from '@angular/core';
import { BadgeDirective } from '@core/directives/badge.directive';
import { BadgeDatePipe } from '@core/pipes/badge.pipe';

@Component({
  selector: 'app-badge',
  imports: [BadgeDatePipe, BadgeDirective],
  templateUrl: './badge.component.html',
})
export class BadgeComponent {
  readonly badgeDate = signal(new Date('2025-12-31'));
  readonly isAvailable = computed(() => this.badgeDate().getTime() > Date.now());
}
