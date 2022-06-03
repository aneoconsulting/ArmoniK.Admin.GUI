import { Injectable } from '@nestjs/common';

@Injectable()
export class SettingsService {
  defaultApplicationName = 'Default Application';

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
}
