import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customColumnPipe', standalone: true })
export class CustomColumnPipe implements PipeTransform {

  transform(value: string | number | symbol): string | null {
    if (typeof value === 'string' && value.startsWith('options.options.')) {
      return value.replace('options.options.', '');
    }
    return null;
  }
}