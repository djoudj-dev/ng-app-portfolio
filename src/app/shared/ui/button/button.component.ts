import { CommonModule } from '@angular/common';
import { Component, computed, input, output, Signal } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  template: `
    <button
      class="focus:outline-none w-full font-semibold tracking-wide text-base"
      [type]="type()"
      [ngClass]="buttonClasses()"
      [disabled]="disabled()"
      (click)="buttonClick.emit($event)"
    >
      @if (isLoading()) {
        <span class="inline-block mr-2">
          <svg
            class="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      }
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  readonly buttonClick = output<MouseEvent>();
  readonly text = input<string>('');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly color = input<'primary' | 'secondary' | 'accent'>('primary');
  readonly disabled = input<boolean>(false);
  readonly noRounded = input<boolean>(false);
  readonly rounded = input<boolean>(true);
  readonly customClass = input<string>('');
  readonly isLoading = input<boolean>(false);

  readonly buttonClasses: Signal<Record<string, boolean>> = computed(() => ({
    // Couleurs dynamiques
    'bg-primary text-white hover:bg-primary/80 focus:bg-primary/70 active:bg-primary/90': this.color() === 'primary',
    'bg-secondary text-white hover:bg-secondary/80 focus:bg-secondary/70 active:bg-secondary/90':
      this.color() === 'secondary',
    'bg-accent text-white hover:bg-accent/80 focus:bg-accent/70 active:bg-accent/90': this.color() === 'accent',

    // Animation ultra smooth
    'transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95': true,

    // Coins
    'rounded-lg': this.rounded(),
    'rounded-none': this.noRounded(),

    // Custom class
    [this.customClass()]: !!this.customClass(),

    // Disabled
    'opacity-50 cursor-not-allowed': this.disabled(),
  }));
}
