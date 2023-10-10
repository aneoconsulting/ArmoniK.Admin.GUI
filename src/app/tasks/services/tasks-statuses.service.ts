import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';


@Injectable()
export class TasksStatusesService {
  readonly statuses: Record<TaskStatus, string> = {
    [TaskStatus.TASK_STATUS_UNSPECIFIED]: $localize`Unspecified`,
    [TaskStatus.TASK_STATUS_DISPATCHED]: $localize`Dispatched`,
    [TaskStatus.TASK_STATUS_CREATING]: $localize`Creating`,
    [TaskStatus.TASK_STATUS_SUBMITTED]: $localize`Submitted`,
    [TaskStatus.TASK_STATUS_PROCESSING]: $localize`Processing`,
    [TaskStatus.TASK_STATUS_PROCESSED]: $localize`Processed`,
    [TaskStatus.TASK_STATUS_CANCELLING]: $localize`Cancelling`,
    [TaskStatus.TASK_STATUS_CANCELLED]: $localize`Cancelled`,
    [TaskStatus.TASK_STATUS_COMPLETED]: $localize`Finished`,
    [TaskStatus.TASK_STATUS_ERROR]: $localize`Error`,
    [TaskStatus.TASK_STATUS_TIMEOUT]: $localize`Timeout`,
    [TaskStatus.TASK_STATUS_RETRIED]: $localize`Retried`,
  };
  /**
   * 
   * @param status Number standing for a task status
   * @returns a string standing for the corresponding task status
   */
  statusToLabel(status: TaskStatus): string {
    return this.statuses[status];
  }

  /**
   * 
   * @param status Number standing for a task status
   * @returns true if status corresponds to TaskStatus.TASK_STATUS_RETRIED number
   */
  isRetried(status: TaskStatus): boolean {
    return status === TaskStatus.TASK_STATUS_RETRIED;
  }
}
