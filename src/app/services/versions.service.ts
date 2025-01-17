import { Injectable, signal } from '@angular/core';

@Injectable()
export class VersionsService {
  readonly core = signal<string | undefined>(undefined);
  readonly api = signal<string | undefined>(undefined);

  /**
   * Check if the version is only composed from numbers.
   * If it is, returns it. If not, returns the VERSION_NOT_FOUND.
   */
  private formatVersion(version: string | null): string | undefined {
    if (version !== null) {
      const versionNumber = version.split('.').map(versionPart => Number(versionPart));
      const isInvalidNumber = versionNumber.some(number => Number.isNaN(number));
      if (!isInvalidNumber) {
        return this.fixVersion(versionNumber);
      }
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
    const fixedApiVersion = this.fixApiVersion(version);
    this.api.set(this.formatVersion(fixedApiVersion));
  }

  // TEMPORARY FIX - The API returns a string that is composed of the current version and its commmit SHA. We only keep the version.
  private fixApiVersion(version: string | null) {
    return version?.split('+')[0] ?? null;
  }
}
