import { inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription, catchError, map, of, switchMap } from 'rxjs';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { DataRaw } from '../data';
import { GetResponse, GrpcGetInterface } from '../services/grpcService';

export type ShowActionButton = {
  id: string;
  name: string;
  icon?: string;
  disabled?: Subject<boolean>;
  link?: string;
  color?: 'accent' | 'primary';
  queryParams?: { [x: string]: string; };
  area?: 'left' | 'right';
  action$?: Subject<void>;
};

export interface ShowCancellableInterface {
  cancel$: Subject<void>;
  cancel(): void;
  canCancel$: Subject<boolean>;
}

export interface ShowClosableInterface {
  close$: Subject<void>;
  close(): void;
  canClose$: Subject<boolean>;
}

export interface ShowActionInterface {
  actionButtons: ShowActionButton[];
}

export abstract class AppShowComponent<T extends DataRaw, R extends GetResponse> {
  id: string;
  sharableURL: string = '';
  refresh = new Subject<void>();
  data = signal<T | null>(null);
  subscriptions = new Subscription();

  private readonly iconsService = inject(IconsService);
  abstract readonly grpcService: GrpcGetInterface<R>;
  private readonly shareURLService = inject(ShareUrlService);
  private readonly notificationService = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  onRefresh() {
    this.refresh.next();
  }

  subscribeToData() {
    const refreshSubscription = this.refresh.pipe(
      switchMap(() => {
        return this.get$();
      }),
      map((data) => this.getDataFromResponse(data) ?? null),
      catchError((error) => this.handleError(error))
    ).subscribe((data) => {
      this.data.set(data);
      this.afterDataFetching();
    });
    this.subscriptions.add(refreshSubscription);
  }

  private get$(): Observable<R> {
    return this.grpcService.get$(this.id);
  }

  unsubscribe() {
    this.subscriptions.unsubscribe();
  }

  abstract getDataFromResponse(data: R): T | undefined;

  abstract afterDataFetching(): void;

  getIdByRoute() {
    this.route.params.pipe(
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
    return this.shareURLService.generateSharableURL(null, null);
  }

  error(message: string) {
    return this.notificationService.error(message);
  }

  success(message: string) {
    return this.notificationService.success(message);
  }
}
