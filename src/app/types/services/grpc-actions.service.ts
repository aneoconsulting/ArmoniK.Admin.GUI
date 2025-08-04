import { inject, Injectable, OnDestroy } from '@angular/core';
import { TaskOptions } from '@app/tasks/types';
import { GrpcAction } from '@app/types/actions.type';
import { Status, StatusService } from '@app/types/status';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { NotificationService } from '@services/notification.service';
import { of, Subject, Subscription } from 'rxjs';
import { DataRaw } from '../data';
import { GrpcTableService } from './grpcService';
import { FiltersEnums, FiltersOptionsEnums } from '../filters';

@Injectable()
export abstract class GrpcActionsService<T extends DataRaw, S extends Status, F extends FiltersEnums, O extends TaskOptions | null = null, FO extends FiltersOptionsEnums | null = null> implements OnDestroy {
  protected abstract readonly statusesService: StatusService<S>;
  protected abstract readonly grpcService: GrpcTableService<T, F, O, FO>;
  protected readonly notificationService = inject(NotificationService);

  protected readonly subscriptions = new Subscription();

  refresh: Subject<void> | null = null;
  actions: GrpcAction<T>[] = [];

  protected success(message: string) {
    return this.notificationService.success(message);
  }

  protected error(message: string) {
    return this.notificationService.error(message);
  }

  protected handleError(error: GrpcStatusEvent, customMessage?: string) {
    this.error(customMessage ? customMessage : $localize`An error occured.`);
    console.error(error);
    return of(null);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}