import { Injectable } from '@angular/core';

@Injectable()
export class VersionsService {
  core: number[] | null = null;
  api: number[] | null = null;



  setCoreVersion(version: string): void {
    const coreNumber = this.#formatVersion(version);
    this.core = this.#formatVersion(this.#fixVersion(coreNumber));
  }

  setAPIVersion(version: string): void {
    const APINumber = this.#formatVersion(version);
    this.core = this.#formatVersion(this.#fixVersion(APINumber));
  }

  #formatVersion(version: string): number[] {
    const versionParts = version.split('.');
    const arr = versionParts.map( versionPart =>  Number(versionPart));
    return arr;
  }
  
  #fixVersion(version: number[]): string {
    // If version has 4 numbers, remove the last one

    if (version.length === 4) {
      version.pop();
    }

    return version.join('.');
  }
}
