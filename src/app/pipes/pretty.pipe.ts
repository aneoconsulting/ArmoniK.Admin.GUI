import { Pipe, PipeTransform } from '@angular/core';

/**
 * Changes the syntax of a camelCase string by removing "_", place a
 * space between each UpperCase character, and put this character in lowercase,
 * and turn the first character to an uppercase character
 * @param key string to format
 * @returns formatted string
 */
@Pipe({ name: 'pretty' })
export class PrettyPipe implements PipeTransform {
  transform(key: string | number | symbol) {
    return key.toString().replaceAll('_', '').replaceAll(/(?<!^)([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }
}