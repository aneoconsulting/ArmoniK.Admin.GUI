import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { Page } from '../pages';
import { GrpcService } from '../services';

export type ShowActionButton = {
  id: string;
  name: string;
  icon?: string;
  disabled?: boolean;
  link?: string;
  color?: 'accent' | 'primary';
  queryParams?: { [x: string]: string; };
  area?: 'left' | 'right';
  action$?: Subject<void>;
};

export interface ShowCancellableInterface {
  cancel$: Subject<void>;

  cancelSession(): void;
  canCancel(): boolean;
}

export interface ShowActionInterface {
  actionButtons: ShowActionButton[];
}

export abstract class AppShowComponent<T extends object, E extends GrpcService> {
  id: string;
  sharableURL: string = '';
  refresh = new Subject<void>();
  data: T | null;
  
  protected _iconsService: IconsService;
  protected _grpcService: E;
  protected _shareURLService: ShareUrlService;
  protected _notificationService: NotificationService;
  protected _route: ActivatedRoute;

  getPageIcon(page: Page): string {
    return this._iconsService.getPageIcon(page);
  }

  getIcon(name: string): string {
    return this._iconsService.getIcon(name);
  }

  onRefresh() {
    this.refresh.next();
  }
}