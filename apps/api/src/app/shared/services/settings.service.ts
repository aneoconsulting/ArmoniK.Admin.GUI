import { Injectable } from '@nestjs/common';

@Injectable()
export class SettingsService {
  defaultApplicationName = '_Default_Application';
  defaultVersion = '_0.0.0';

  /**
   * Handle default application (non-set in database)
   *
   * @param applicationName
   *
   * @returns applicationName
   */
  getApplicationName(applicationName: string): string | null {
    if (applicationName === this.defaultApplicationName) {
      return null;
    }

    return applicationName;
  }

  /**
   * Handle default version (non-set in database)
   *
   * @param version
   *
   * @returns version
   */
  getVersion(version: string): string | null {
    if (version === this.defaultVersion) {
      return null;
    }

    return version;
  }
}
