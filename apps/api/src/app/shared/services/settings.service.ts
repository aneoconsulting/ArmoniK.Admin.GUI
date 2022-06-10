import { Injectable } from '@nestjs/common';

@Injectable()
export class SettingsService {
  // Use an _ before default to avoid conflict with real name
  defaultApplicationName = '_Default_Application';
  defaultApplicationVersion = '_0.0.0';

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
  getApplicationVersion(version: string): string | null {
    if (version === this.defaultApplicationVersion) {
      return null;
    }

    return version;
  }
}
