import { TaskOptionEnumField, TaskStatus, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { inject, Injectable } from '@angular/core';
import { GrpcActionsService } from '@app/types/services/grpc-actions.service';
import { StatusService } from '@app/types/status';
import { catchError, Subject, switchMap } from 'rxjs';
import { TaskOptions, TaskRaw, TaskSummary } from '../types';
import { TasksGrpcService } from './tasks-grpc.service';
import { TasksStatusesService } from './tasks-statuses.service';


/**
 * Service used for session index, table and inspection components to share a common configuration of their grpc-related actions.
 * 
 * Provided actions:
 * - Cancel
 */
@Injectable()
export class TasksGrpcActionsService extends GrpcActionsService<TaskSummary | TaskRaw, TaskStatus, TaskSummaryEnumField, TaskOptions, TaskOptionEnumField> {
  protected readonly statusesService = inject(StatusService) as TasksStatusesService;
  protected readonly grpcService = inject(TasksGrpcService);

  private readonly cancel$ = new Subject<(TaskSummary | TaskRaw)[]>();

  constructor() {
    super();
    this.actions.push(
      {
        label: $localize`Cancel Task`,
        icon: 'cancel',
        condition: (tasks) => tasks.reduce((acc, task) => acc || this.statusesService.taskNotEnded(task.status), false),
        click: (tasks) => this.cancel$.next(tasks),
      }
    );
  }

  protected subscribeToActions(refresh?: Subject<void> | null): void {
    const cancelSubscription$ = this.cancel$.pipe(
      switchMap(tasks => this.grpcService.cancel$(tasks.map(task => task.id))),
      catchError(error => this.handleError(error)),
    ).subscribe((result) => {
      if (result?.tasks) {
        this.success(result.tasks.length === 1 ? $localize`Task cancelled` : $localize`Tasks cancelled`);
        if (refresh) {
          refresh.next();
        }
      }
    });
    this.subscriptions.add(cancelSubscription$);
  }
}