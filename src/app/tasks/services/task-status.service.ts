import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';

@Injectable()
export class TaskStatusService {
  readonly statuses: Record<TaskStatus, string> = {
    [TaskStatus.TASK_STATUS_UNSPECIFIED]: 'Unspecified',
    [TaskStatus.TASK_STATUS_DISPATCHED]: 'Dispatched',
    [TaskStatus.TASK_STATUS_CREATING]: 'Creating',
    [TaskStatus.TASK_STATUS_SUBMITTED]: 'Submitted',
    [TaskStatus.TASK_STATUS_PROCESSING]: 'Processing',
    [TaskStatus.TASK_STATUS_PROCESSED]: 'Processed',
    [TaskStatus.TASK_STATUS_CANCELLING]: 'Cancelling',
    [TaskStatus.TASK_STATUS_CANCELLED]: 'Cancelled',
    [TaskStatus.TASK_STATUS_COMPLETED]: 'Finished',
    [TaskStatus.TASK_STATUS_ERROR]: 'Error',
    [TaskStatus.TASK_STATUS_TIMEOUT]: 'Timeout',
  };

  statusToLabel(status: TaskStatus): string {
    return this.statuses[status];
  }
}
