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
    'dashboard': 'dashboard',
    'profile': 'account_circle',
    // TODO: rename page to 'permissions' (or endpoint)
    // 'general': 'public',
    // 'events': 'send',
  };

  readonly icons: Record<string, string> = {
    'refresh': 'refresh',
    'auto-refresh': 'autorenew',
    'modify-columns': 'view_column',
    'more': 'more_vert',
    'clear': 'clear',
    'delete': 'delete',
    'add': 'add',
    'share': 'share',
    'done': 'done',
    'drag': 'drag_indicator',
    'edit': 'edit',
    'view': 'visibility',
    'view-off': 'visibility_off',
    'format-color-fill': 'format_color_fill',
    'settings': 'settings',
    'storage': 'storage',
    'download': 'file_download',
    'upload': 'file_upload',
    'cancel': 'cancel',
    'copy': 'content_copy',
    'hub': 'hub',
    'api': 'api',
    'help': 'help_outline',
    'update': 'update',
    'tune': 'tune',
    'arrow-down': 'arrow_drop_down',
    'layers-clear': 'layers_clear',
    'format-clear': 'format_color_reset',
    'highlight': 'highlight',
    'list': 'view_list',
    'vertical-split': 'vertical_split',
    'find-logs': 'plagiarism',
  };

  getIcon(name: string): string {
    const icon = this.icons[name];

    if (!icon) {
      throw new Error(`Icon '${name}' not found`);
    }

    return this.icons[name];
  }

  getPageIcon(name: Page) {
    return this.pageIcons[name];
  }
}
