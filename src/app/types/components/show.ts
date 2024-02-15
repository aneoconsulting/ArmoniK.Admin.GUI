import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, map, of } from 'rxjs';
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

  cancel(): void;
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
  
  private _iconsService = inject(IconsService);
  protected _grpcService: E;
  private _shareURLService = inject(ShareUrlService);
  private _notificationService = inject(NotificationService);
  private _route = inject(ActivatedRoute);

  getPageIcon(page: Page): string {
    return this._iconsService.getPageIcon(page);
  }

  getIcon(name: string): string {
    return this._iconsService.getIcon(name);
  }

  onRefresh() {
    this.refresh.next();
  }

  getIdByRoute() {
    this._route.params.pipe(
      map(params => params['id']),
    ).subscribe(id => {
      this.id = id;
      this.refresh.next();
    });
  }

  handleError(error: Error) {
    this.error($localize`Could not retrieve data.`);
    console.error(error);
    return of(null);
  }

  getSharableUrl() {
    return this._shareURLService.generateSharableURL(null, null);
  }

  error(message: string) {
    return this._notificationService.error(message);
  }

  success(message: string) {
    return this._notificationService.success(message);
  }
}