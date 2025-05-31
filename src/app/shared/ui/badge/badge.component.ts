import { Component, computed, input } from '@angular/core';
import { BadgeDirective } from '@feat/admin/badge/directives/badge.directive';
import { BadgeDate } from '@feat/admin/badge/pipes/badge.pipe';
import { Badge, BadgeStatus } from '@feat/admin/badge/interface/badge.interface';

type BadgePreview = Pick<Badge, 'status' | 'availableUntil'>;

@Component({
  selector: 'app-badge',
  imports: [BadgeDate, BadgeDirective],
  templateUrl: './badge.component.html',
})
export class BadgeComponent {
  readonly badge = input<BadgePreview | null>(null);

  readonly badgeDate = computed(() => {
    const badge = this.badge();
    if (badge?.status === BadgeStatus.DISPONIBLE_A_PARTIR_DE && badge.availableUntil) {
      return new Date(badge.availableUntil);
    }
    return new Date();
  });

  readonly isAvailable = computed(() => this.badgeDate().getTime() > Date.now());

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
