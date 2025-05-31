import { Component, computed, effect, inject, input, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { Badge, BadgeStatus } from '@feat/admin/badge/interface/badge.interface';
import { BadgeService } from '@feat/admin/badge/service/badge.service';
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

  status = signal<BadgeStatus>(BadgeStatus.DISPONIBLE);
  availableUntil = signal<string | null>(null);
  internalBadge = signal<Badge | null>(null);

  badgeStatusOptions = signal<BadgeStatus[]>([
    BadgeStatus.DISPONIBLE,
    BadgeStatus.INDISPONIBLE,
    BadgeStatus.DISPONIBLE_A_PARTIR_DE,
  ]);

  isEditMode = computed(() => !!this.badge());

  showDateField = computed(() => this.status() === BadgeStatus.DISPONIBLE_A_PARTIR_DE);

  isCurrentlyAvailable(): boolean {
    const stat = this.status();
    if (stat === BadgeStatus.DISPONIBLE) return true;
    if (stat === BadgeStatus.INDISPONIBLE) return false;
    const dateStr = this.availableUntil();
    return dateStr ? new Date(dateStr) <= new Date() : false;
  }

  initFromBadge = effect(() => {
    const b = this.badge();
    if (b) {
      this.internalBadge.set(b);
      this.status.set(b.status);
      this.availableUntil.set(
        b.availableUntil ? this.formatDateForInput(b.availableUntil) : this.formatDateForInput(new Date())
      );
    }
  });

  autoFillAvailableUntil = effect(() => {
    if (!this.badge() && this.status() === BadgeStatus.DISPONIBLE_A_PARTIR_DE && !this.availableUntil()) {
      this.availableUntil.set(this.formatDateForInput(new Date()));
    }
  });

  formValid = computed(() => {
    return !!this.status() && (this.status() !== BadgeStatus.DISPONIBLE_A_PARTIR_DE || !!this.availableUntil());
  });

  onSubmit(): void {
    if (!this.formValid()) return;

    const formData = this.prepareFormData();

    if (this.isEditMode()) {
      this.badgeService.updateBadge(this.badge()!.id, formData).subscribe({
        next: () => {
          this.saved.set(true);
          this.toastService.showSuccess('Badge mis à jour avec succès');

          const updatedBadge: Badge = {
            ...this.badge()!,
            ...formData,
          };

          this.badgeService.selectedBadge.set(updatedBadge);
        },
        error: () => {
          console.error();
          this.toastService.showError('Erreur lors de la mise à jour du badge');
        },
      });
    } else {
      this.toastService.showInfo("La création de badge n'est pas encore disponible");
    }
  }

  onCancel(): void {
    this.status.set(BadgeStatus.DISPONIBLE);
    this.availableUntil.set(null);
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

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private prepareFormData(): Partial<Badge> {
    return {
      status: this.status(),
      availableUntil:
        this.status() === BadgeStatus.DISPONIBLE_A_PARTIR_DE && this.availableUntil()
          ? new Date(this.availableUntil()!)
          : null,
    };
  }
}
