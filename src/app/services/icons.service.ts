import { Injectable } from '@angular/core';
import { Page } from '@app/types/pages';

@Injectable()
export class IconsService {
  readonly pageIcons: Record<Page, string> = {
    'applications': 'apps',
    'partitions': 'donut_small',
    'sessions': 'workspaces',
    'results': 'workspace_premium',
  };

  getPageIcon(name: Page) {
    return this.pageIcons[name];
  }
}
