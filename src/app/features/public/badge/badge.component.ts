import { Component, computed, signal } from '@angular/core';
import { STATIC_BADGE } from '@feat/public/badge/data/badge.data';
import { Badge, BadgeStatus } from '@feat/public/badge/interface/badge.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  imports: [NgClass],
})
export class BadgeComponent {
  readonly badge = signal<Badge>(STATIC_BADGE);
  readonly badgeDate = computed(() => this.badge().availableUntil ?? new Date());

  getStatusLabel(): string {
    switch (this.badge().status) {
      case BadgeStatus.DISPONIBLE:
        return 'Disponible';
      case BadgeStatus.INDISPONIBLE:
        return 'Indisponible';
      case BadgeStatus.DISPONIBLE_A_PARTIR_DE:
        return `Disponible à partir du ${this.badgeDate().toLocaleDateString()}`;
      default:
        return '';
    }
  }

  getStatusClass(): string {
    switch (this.badge().status) {
      case BadgeStatus.DISPONIBLE:
        return 'bg-green-700';
      case BadgeStatus.INDISPONIBLE:
        return 'bg-red-600';
      case BadgeStatus.DISPONIBLE_A_PARTIR_DE:
        return 'bg-accent-500';
      default:
        return 'bg-gray-300';
    }
  }
}
