import { Injectable } from '@angular/core';

/**
 * Handles operations related to bytes arrays.
 */
@Injectable()
export class ByteArrayService {
  private readonly decoder = new TextDecoder('utf-8', { fatal: true });
  
  /**
   * Decodes the value of a byteArray into a readable string. If the string is invalid, return null.
   * @param input Uint8Array
   * @returns string | null
   */
  decode(input: Uint8Array): string | null {
    try {
      return this.decoder.decode(input);
    } catch {
      return null;
    }
  }

  /**
   * Displays the bytelength as a readable string in octects, kilo-octects, mega-octets or giga-octets.
   * Returns null when the size is equal to 0
   * @param byteLength number
   * @returns string | null
   */
  byteLengthToString(byteLength: number): string | null {
    if (byteLength === 0) {
      return null;
    }

    const sizes = ['o', 'Ko', 'Mo', 'Go'];

    let index = 0;
    while (index !== 3 && byteLength > 1000) {
      byteLength = byteLength / 1000;
      index++;
    }

    return `${byteLength.toFixed(2)} ${sizes[index]}`;
  }
}