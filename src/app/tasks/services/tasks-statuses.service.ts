import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { StatusesServiceI } from '@app/types/services';


@Injectable()
export class TasksStatusesService implements StatusesServiceI<TaskStatus> {
  readonly statuses: Record<TaskStatus, string> = {
    [TaskStatus.TASK_STATUS_UNSPECIFIED]: $localize`Unspecified`,
    [TaskStatus.TASK_STATUS_DISPATCHED]: $localize`Dispatched`,
    [TaskStatus.TASK_STATUS_CREATING]: $localize`Creating`,
    [TaskStatus.TASK_STATUS_SUBMITTED]: $localize`Submitted`,
    [TaskStatus.TASK_STATUS_PROCESSING]: $localize`Processing`,
    [TaskStatus.TASK_STATUS_PROCESSED]: $localize`Processed`,
    [TaskStatus.TASK_STATUS_CANCELLING]: $localize`Cancelling`,
    [TaskStatus.TASK_STATUS_CANCELLED]: $localize`Cancelled`,
    [TaskStatus.TASK_STATUS_COMPLETED]: $localize`Completed`,
    [TaskStatus.TASK_STATUS_ERROR]: $localize`Error`,
    [TaskStatus.TASK_STATUS_TIMEOUT]: $localize`Timeout`,
    [TaskStatus.TASK_STATUS_RETRIED]: $localize`Retried`,
  };

  statusesRecord(): { value: string, name: string }[] {
    const values = Object.values(this.statuses).sort((a, b) => a.toString().localeCompare(b.toString()));
    const keys = Object.keys(this.statuses).sort((a, b) => a.toString().localeCompare(b.toString()));
    const sortedKeys = values.map((value) => {
      return keys.find((key) => {
        return this.statuses[Number(key) as TaskStatus] === value;
      });
    });

    return (sortedKeys.filter(Boolean) as string[]).map((key) => {
      const status = Number(key) as TaskStatus;
      return {
        value: key,
        name: this.statusToLabel(status)
      };
    });
  }

  /**
   * @param status Number standing for a task status
   * @returns a string standing for the corresponding task status
   */
  statusToLabel(status: TaskStatus): string {
    return this.statuses[status];
  }

  /**
   * @param status Number standing for a task status
   * @returns true if status corresponds to TaskStatus.TASK_STATUS_RETRIED number
   */
  isRetried(status: TaskStatus): boolean {
    return status === TaskStatus.TASK_STATUS_RETRIED;
  }

  /**
   * @param status Number standing for a task status
   * @returns true if status corresponds to TaskStatus.TASK_STATUS_PROCESSED number
   */
  taskNotEnded(taskStatus: TaskStatus) {
    return taskStatus === TaskStatus.TASK_STATUS_PROCESSING || taskStatus === TaskStatus.TASK_STATUS_CREATING || taskStatus === TaskStatus.TASK_STATUS_SUBMITTED 
    || taskStatus === TaskStatus.TASK_STATUS_DISPATCHED || taskStatus === TaskStatus.TASK_STATUS_RETRIED;
  }
}
