import { Injectable } from '@angular/core';

@Injectable()
export class VersionsService {
  core: string | null = null;
  api: string | null = null;

  setCoreVersion(version: string): void {
    this.core = this.#fixVersion(version);
  }

  setAPIVersion(version: string): void {
    this.api = this.#fixVersion(version);
  }

  #fixVersion(version: string): string {
    // If version has 4 numbers, remove the last one
    const versionParts = version.split('.');

    if (versionParts.length === 4) {
      versionParts.pop();
    }

    return versionParts.join('.');
  }
}
