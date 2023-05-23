import { Injectable } from '@angular/core';
import { Page } from '@app/types/pages';

@Injectable()
export class IconsService {
  readonly pageIcons: Record<Page, string> = {
    'applications': 'apps',
    'partitions': 'donut_small',
    'sessions': 'workspaces',
    'tasks': 'adjust',
    'results': 'workspace_premium',
    'submitter': 'api',
  };

  readonly icons: Record<string, string> = {
    'general': 'public',
    'events': 'send',
  };

  getIcon(name: string): string | null {
    return this.icons[name];
  }

  getPageIcon(name: Page) {
    return this.pageIcons[name];
  }
}
