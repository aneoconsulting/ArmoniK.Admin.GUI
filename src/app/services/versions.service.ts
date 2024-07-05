import { Injectable } from '@angular/core';

@Injectable()
export class VersionsService {
  core: string;
  api: string;
  VERSION_NOT_FOUND = '- version indisponible';

  private formatVersion(version: string): number[] {
    const versionParts = version.split('.');
    return versionParts.map(versionPart => Number(versionPart));
  }

  private handleNullableVersion(version: string | null = null): string {
    return version ?? this.VERSION_NOT_FOUND;
  }

  private fixVersion(version: number[]): string {
    if (version.length === 4) {
      version.pop();
    }
    return version.join('.');
  }

  setCoreVersion(version: string | null = null): void {
    const notNullableNumberVersion = this.handleNullableVersion(version);
    const coreNumber = this.formatVersion(notNullableNumberVersion);
    const isInvalidCoreNumber = coreNumber.some(number => Number.isNaN(number));
    this.core = isInvalidCoreNumber ? this.VERSION_NOT_FOUND : this.fixVersion(coreNumber);
  }

  setAPIVersion(version: string | null = null): void {
    const notNullableNumbersVersion = this.handleNullableVersion(version);
    const APINumber = this.formatVersion(notNullableNumbersVersion);
    const isInvalidAPINumber = APINumber.some(number => Number.isNaN(number));
    this.api = isInvalidAPINumber ? this.VERSION_NOT_FOUND : this.fixVersion(APINumber);
  }

}
