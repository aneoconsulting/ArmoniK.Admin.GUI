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
    'healthcheck': 'monitor_heart'
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
    'fill': 'format_color_fill',
    'settings': 'settings',
    'storage': 'storage',
    'download': 'file_download',
    'upload': 'file_upload',
    'pause': 'pause',
    'play': 'play_arrow',
    'cancel': 'cancel',
    'copy': 'content_copy',
    'hub': 'hub',
    'api': 'api',
    'help': 'help_outline',
    'update': 'update',
    'tune': 'tune',
    'arrow-down': 'arrow_drop_down',
    'arrow-up': 'arrow_drop_up',
    'arrow-left': 'arrow_left',
    'arrow-right': 'arrow_right',
    'layers': 'layers',
    'layers-clear': 'layers_clear',
    'format-clear': 'format_color_reset',
    'highlight': 'highlight',
    'list': 'view_list',
    'vertical-split': 'vertical_split',
    'find-logs': 'plagiarism',
    'lock': 'lock',
    'unlock': 'lock_open',
    'language': 'language',
    'manage-customs': 'splitscreen_vertical_add',
    'task-by-status': 'wifi_tethering',
    'default': 'radio_button_unchecked',
    'close': 'do_not_disturb_on',
    'icon': 'palette',
    'publish': 'published_with_changes',
    'description': 'description',
    'star': 'star',
    'terminal': 'terminal',
    'heart': 'favorite',
    'open': 'open_in_new',
    'key': 'key',
    'compare': 'compare_arrows',
    'groups': 'groups',
    'info': 'info',
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

  getAllIcons() {
    return Object.keys(this.icons);
  }
}
