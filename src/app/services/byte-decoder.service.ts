import { Injectable } from '@angular/core';

@Injectable()
export class ByteDecoderService {
  private readonly decoder = new TextDecoder('utf-8', { fatal: true });
  
  decode(input: Uint8Array): string | null {
    try {
      return this.decoder.decode(input);
    } catch {
      return null;
    }
  }
}