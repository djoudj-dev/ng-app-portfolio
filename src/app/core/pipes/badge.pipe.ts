import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'badgeDate',
})
export class BadgeDatePipe implements PipeTransform {
  transform(date: Date): string {
    return date.getTime() > Date.now() ? 'Disponible' : 'Indisponible';
  }
}
