import { Injectable } from '@angular/core';

@Injectable()
export class VersionsService {
  core: string | null = null;
  api: string | null = null;



  setCoreVersion(version: string): void {
    const coreNumber = this.#formatVersion(version);
    const isInvalidCoreNumber = coreNumber.some(number => Number.isNaN(number));
    this.core = isInvalidCoreNumber ? ' version indisponible' : this.#fixVersion(coreNumber);
  }

  setAPIVersion(version: string): void {
    const APINumber = this.#formatVersion(version);
    const isInvalidCoreNumber = APINumber.some(number => Number.isNaN(number));
    this.api = isInvalidCoreNumber ? ' version indisponible' : this.#fixVersion(APINumber);
  }

  #formatVersion(version: string): number[] {
    const versionParts = version.split('.');
    return versionParts.map(versionPart =>  Number(versionPart)); 
  }
  
  #fixVersion(version: number[]): string {
    if (version.length === 4) {
      version.pop();
    }
    return version.join('.');
  } 
  
}
