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

/**
 * Abstract service used by tables, indexes, and show components to share a common configuration for all grpc-related actions (such as pause/resume, purge... for sessions).
 */
@Injectable()
export abstract class GrpcActionsService<T extends DataRaw, S extends Status, F extends FiltersEnums, O extends TaskOptions | null = null, FO extends FiltersOptionsEnums | null = null> implements OnDestroy {
  protected abstract readonly statusesService: StatusService<S>;
  protected abstract readonly grpcService: GrpcTableService<T, F, O, FO>;
  protected readonly notificationService = inject(NotificationService);

  protected readonly subscriptions = new Subscription();
  
  actions: GrpcAction<T>[] = [];

  protected _refresh: Subject<void> | null = null;

  /*
   * Links the provided refresh subject from the table, index, or show component to the grpc actions.
   * The actions are created AFTER the refresh subjects are links.
   */
  set refresh(entry: Subject<void> | null) {
    this._refresh = entry;
  }

  /**
   * Associate a click to an action.
   * @param refresh The provided refresh subject of the class.
   */
  protected abstract subscribeToActions(refresh?: Subject<void> | null): void;

  /**
   * Notifies the success of an action.
   * @param message success message
   */
  protected success(message: string): void {
    return this.notificationService.success(message);
  }

  /**
   * Notifies the success of an action.
   * @param message error message
   */
  protected error(message: string): void {
    return this.notificationService.error(message);
  }

  /**
   * Catch any grpcError, logs it and display a notification for the user.
   * @param error catched grpc error
   * @param customMessage message to display to the user
   * @returns 
   */
  protected handleError(error: GrpcStatusEvent, customMessage?: string) {
    this.error(customMessage ?? $localize`An error occurred.`);
    console.error(error);
    return of(null);
  }

  /**
   * Unsubscribe from all actions to free memory.
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}