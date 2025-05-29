import { inject, Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'badgeDate',
})
export class BadgeDate implements PipeTransform {
  private readonly datePipe = inject(DatePipe);

  transform(value: Date | null | undefined): string {
    if (!value) return 'Non défini';
    return this.datePipe.transform(value, 'dd/MM/yyyy') ?? 'Date invalide';
  }
}
