import { Component, computed, effect, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Badge, BadgeStatus } from '../../interface/badge.interface';
import { BadgeService } from '../../service/badge.service';
import { inject, signal } from '@angular/core';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-badge-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './badge-form.component.html',
})
export class BadgeFormComponent {
  badge = input<Badge | null>(null);
  saved = model<boolean>(false);
  private badgeService = inject(BadgeService);
  private toastService = inject(ToastService);

  badgeForm = new FormGroup({
    status: new FormControl<BadgeStatus>(BadgeStatus.DISPONIBLE, [Validators.required]),
    availableUntil: new FormControl<string | null>(null),
  });

  badgeStatusOptions = signal<BadgeStatus[]>([
    BadgeStatus.DISPONIBLE,
    BadgeStatus.INDISPONIBLE,
    BadgeStatus.DISPONIBLE_A_PARTIR_DE,
  ]);

  isEditMode = computed(() => !!this.badge());
  showDateField = computed(() => this.badgeForm.get('status')?.value === BadgeStatus.DISPONIBLE_A_PARTIR_DE);

  constructor() {
    effect(() => {
      const currentBadge = this.badge();
      if (currentBadge) {
        this.badgeForm.patchValue({
          status: currentBadge.status,
          availableUntil: currentBadge.availableUntil ? this.formatDateForInput(currentBadge.availableUntil) : null,
        });
      }
    });

    effect(() => {
      const status = this.badgeForm.get('status')?.value;
      const available = this.badgeForm.get('availableUntil');
      if (status === BadgeStatus.DISPONIBLE_A_PARTIR_DE) {
        available?.setValidators([Validators.required]);
      } else {
        available?.clearValidators();
      }
      available?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.badgeForm.invalid) return;

    const formData = this.prepareFormData();

    if (this.isEditMode()) {
      this.badgeService.updateBadge(this.badge()!.id, formData).subscribe({
        next: () => {
          this.saved.set(true);
          this.toastService.showSuccess('Badge mis à jour avec succès');
        },
        error: (err) => {
          console.error('Erreur maj badge', err);
          this.toastService.showError('Erreur lors de la mise à jour du badge');
        },
      });
    } else {
      // Si on veut permettre la création de badge dans le futur
      this.toastService.showInfo("La création de badge n'est pas encore disponible");
    }
  }

  onCancel(): void {
    this.badgeForm.reset({
      status: BadgeStatus.DISPONIBLE,
      availableUntil: null,
    });
    this.toastService.showInfo('Modifications annulées');
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

  isCurrentlyAvailable(): boolean {
    const status = this.badgeForm.get('status')?.value;
    if (status === BadgeStatus.DISPONIBLE) return true;
    if (status === BadgeStatus.INDISPONIBLE) return false;
    const dateStr = this.badgeForm.get('availableUntil')?.value;
    return dateStr ? new Date(dateStr) <= new Date() : false;
  }

  parseDate(dateStr: string | null | undefined): Date | null {
    return dateStr ? new Date(dateStr) : null;
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().slice(0, 16);
  }

  private prepareFormData(): Partial<Badge> {
    const formValue = this.badgeForm.value;
    return {
      status: formValue.status as BadgeStatus,
      availableUntil:
        formValue.status === BadgeStatus.DISPONIBLE_A_PARTIR_DE && formValue.availableUntil
          ? new Date(formValue.availableUntil)
          : null,
    };
  }
}
