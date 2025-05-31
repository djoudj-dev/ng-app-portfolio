import { Directive, ElementRef, effect, inject, input } from '@angular/core';
import { BadgeStatus } from '@feat/admin/badge/interface/badge.interface';

@Directive({
  selector: '[appBadge]',
})
export class BadgeDirective {
  readonly appBadge = input<BadgeStatus | null>();
  private readonly el = inject(ElementRef<HTMLElement>);

  constructor() {
    effect(() => {
      const status = this.appBadge();
      if (status) this.applyStatusClass(status);
    });
  }

  private applyStatusClass(status: BadgeStatus): void {
    const el = this.el.nativeElement;

    el.classList.remove('bg-green-800', 'bg-red-500', 'bg-accent', 'text-text');

    if (!el.classList.contains('animate-pulse')) {
      el.classList.add('animate-pulse');
    }

    switch (status) {
      case BadgeStatus.DISPONIBLE:
        el.classList.add('bg-green-800', 'text-text');
        break;
      case BadgeStatus.INDISPONIBLE:
        el.classList.add('bg-red-500', 'text-text');
        break;
      case BadgeStatus.DISPONIBLE_A_PARTIR_DE:
        el.classList.add('bg-accent', 'text-text');
        break;
    }
  }
}
