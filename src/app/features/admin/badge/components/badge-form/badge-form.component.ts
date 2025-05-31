import { Component, computed, effect, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Badge, BadgeStatus } from '../../interface/badge.interface';
import { BadgeService } from '../../service/badge.service';
import { inject, signal } from '@angular/core';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { ToastService } from '@core/services/toast.service';
import { ToastComponent } from '@shared/ui/toast/toast.component';

@Component({
  selector: 'app-badge-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonComponent, ToastComponent],
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
  showDateField = signal<boolean>(false);

  constructor() {
    effect(() => {
      const currentBadge = this.badge();
      if (currentBadge) {
        // Set form values from badge
        this.badgeForm.patchValue({
          status: currentBadge.status,
          availableUntil: currentBadge.availableUntil
            ? this.formatDateForInput(currentBadge.availableUntil)
            : this.formatDateForInput(new Date()),
        });

        this.showDateField.set(currentBadge.status === BadgeStatus.DISPONIBLE_A_PARTIR_DE);

        if (currentBadge.status === BadgeStatus.DISPONIBLE_A_PARTIR_DE && !currentBadge.availableUntil) {
          const today = new Date();
          this.badgeForm.get('availableUntil')?.setValue(this.formatDateForInput(today));
        }
      }
    });

    effect(() => {
      const currentBadge = this.badge();

      if (!currentBadge) {
        const status = this.badgeForm.get('status')?.value;
        if (status === BadgeStatus.DISPONIBLE_A_PARTIR_DE) {
          this.badgeForm.get('availableUntil')?.setValue(this.formatDateForInput(new Date()));
        }
      }
    });

    this.badgeForm.get('status')?.valueChanges.subscribe((value) => {
      if (value === BadgeStatus.DISPONIBLE_A_PARTIR_DE) {
        const ctrl = this.badgeForm.get('availableUntil');
        if (!ctrl?.value) {
          ctrl?.setValue(this.formatDateForInput(new Date()));
        }
      } else {
        this.badgeForm.get('availableUntil')?.setValue(null);
      }

      this.showDateField.set(value === BadgeStatus.DISPONIBLE_A_PARTIR_DE);
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
    return date.toISOString().split('T')[0];
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
