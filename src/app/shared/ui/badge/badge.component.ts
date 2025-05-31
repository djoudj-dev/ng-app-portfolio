import { Component, computed, effect, input, signal } from '@angular/core';
import { BadgeDirective } from '@feat/admin/badge/directives/badge.directive';
import { BadgeDate } from '@feat/admin/badge/pipes/badge.pipe';
import { BadgeStatus } from '@feat/admin/badge/interface/badge.interface';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [BadgeDate, BadgeDirective],
  templateUrl: './badge.component.html',
})
export class BadgeComponent {
  readonly badge = input<{ status: BadgeStatus }>();
  readonly badgeDate = signal<Date>(new Date());
  readonly badgeForm = input<FormGroup>();
  readonly isAvailable = computed(() => this.badgeDate().getTime() > Date.now());

  constructor() {
    effect(() => {
      const currentBadge = this.badge();
      if (currentBadge?.status === 'DISPONIBLE_A_PARTIR_DE') {
        // Set date to current year instead of hardcoded 2025
        const currentYear = new Date().getFullYear();
        this.badgeDate.set(new Date(`${currentYear}-12-31`));
      } else {
        this.badgeDate.set(new Date());
      }
    });
  }

  getStatusLabel(status: BadgeStatus | null | undefined): string {
    switch (status) {
      case BadgeStatus.DISPONIBLE:
        return 'Disponible';
      case BadgeStatus.INDISPONIBLE:
        return 'Indisponible';
      case BadgeStatus.DISPONIBLE_A_PARTIR_DE:
        return 'Disponible à partir de';
      default:
        return '';
    }
  }
}
