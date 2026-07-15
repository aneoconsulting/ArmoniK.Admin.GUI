import { Injectable, signal } from '@angular/core';

@Injectable()
export class VersionsService {
  readonly core = signal<string | undefined>(undefined);
  readonly api = signal<string | undefined>(undefined);

  /**
   * Format the version as "major.minor.patch", ignoring any pre-release or build suffix.
   * Falls back to the raw string when it cannot be parsed as numbers,
   * and to undefined when there is no version at all.
   */
  private formatVersion(version: string | null): string | undefined {
    if (version !== null) {
      const versionNumber = version.split(/[+-]/)[0].split('.').map(Number);
      const isInvalidNumber = versionNumber.some(number => Number.isNaN(number));
      if (!isInvalidNumber) {
        return this.fixVersion(versionNumber);
      }
      return version;
    }
    return undefined;
  }

  private fixVersion(version: number[]): string {
    if (version.length === 4) {
      version.pop();
    }
    return version.join('.');
  }

  setCoreVersion(version: string | null = null): void {
    this.core.set(this.formatVersion(version));
  }

  setAPIVersion(version: string | null = null): void {
    this.api.set(this.formatVersion(version));
  }

}
