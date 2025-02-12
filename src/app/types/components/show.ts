import { inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { Observable, Subject, Subscription, catchError, map, of, switchMap } from 'rxjs';
import { Field } from '../column.type';
import { DataRaw } from '../data';
import { GetResponse, GrpcGetInterface } from '../services/grpcService';
import { InspectionService } from '../services/inspectionService';

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

  fields: Field<T>[];

  abstract readonly grpcService: GrpcGetInterface<R>;
  abstract readonly inspectionService: InspectionService<T>;

  private readonly iconsService = inject(IconsService);
  private readonly shareURLService = inject(ShareUrlService);
  private readonly notificationService = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);

  initInspection() {
    this.sharableURL = this.getSharableUrl();
    this.setFields();
    this.subscribeToData();
    this.getIdByRoute();
    this.refresh.next();
  }

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
      catchError((error: GrpcStatusEvent) => this.handleError(error))
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

  setFields() {
    this.fields = this.inspectionService.fields;
  }

  handleError(error: GrpcStatusEvent) {
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
