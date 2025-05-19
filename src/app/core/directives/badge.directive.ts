import { Directive, ElementRef, effect, input } from '@angular/core';

@Directive({
  selector: '[appBadge]',
})
export class BadgeDirective {
  readonly isAvailable = input<boolean>(true);

  constructor(private el: ElementRef<HTMLElement>) {
    effect(() => this.updateBadgeColor(this.isAvailable()));
  }

  private updateBadgeColor(isAvailable: boolean): void {
    const classList = this.el.nativeElement.classList;
    classList.remove('bg-green-600', 'bg-red-500');
    classList.add(isAvailable ? 'bg-green-600' : 'bg-red-500');
  }
}
