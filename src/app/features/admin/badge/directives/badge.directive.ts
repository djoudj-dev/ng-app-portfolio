import { Directive, ElementRef, effect, inject, input, signal } from '@angular/core';
import { BadgeStatus } from '@feat/admin/badge/interface/badge.interface';

@Directive({
  selector: '[appBadge]',
})
export class BadgeDirective {
  readonly appBadge = input<BadgeStatus | null>();
  private readonly badgeStatusColor = signal<BadgeStatus>(BadgeStatus.DISPONIBLE);
  private readonly el = inject(ElementRef<HTMLElement>);

  constructor() {
    effect(() => {
      const newStatus = this.appBadge();

      if (!newStatus) return;

      this.badgeStatusColor.set(newStatus);
      this.updateColor(newStatus);
    });
  }

  private updateColor(status: BadgeStatus): void {
    const element = this.el.nativeElement;

    // Supprimer les anciennes classes
    element.classList.remove('bg-primary', 'bg-secondary', 'bg-accent', 'text-text');

    // S'assurer que la classe animate-pulse est présente
    if (!element.classList.contains('animate-pulse')) {
      element.classList.add('animate-pulse');
    }

    // Appliquer les classes selon le statut
    switch (status) {
      case BadgeStatus.DISPONIBLE:
        element.classList.add('bg-green-800', 'text-text');
        break;
      case BadgeStatus.INDISPONIBLE:
        element.classList.add('bg-red-500', 'text-text');
        break;
      case BadgeStatus.DISPONIBLE_A_PARTIR_DE:
        element.classList.add('bg-accent', 'text-text');
        break;
    }
  }
}
