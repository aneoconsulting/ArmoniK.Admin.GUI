import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'emptyCell' })
export class EmptyCellPipe implements PipeTransform {
  transform(value: unknown) {
    if (value === undefined || value === null || value === '') {
      return '-';
    }

    return value;
  }
}
