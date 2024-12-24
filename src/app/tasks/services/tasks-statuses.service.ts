import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { StatusLabelColor, StatusService } from '@app/types/status';


@Injectable()
export class TasksStatusesService extends StatusService<TaskStatus> {
  readonly statuses: Record<TaskStatus, StatusLabelColor> = {
    [TaskStatus.TASK_STATUS_UNSPECIFIED]: {
      label: 'Unspecified',
      color: '#A9A9A9'
    },
    [TaskStatus.TASK_STATUS_CREATING]: {
      label: 'Creating',
      color: '#008B8B',
      icon: 'add',
    },
    [TaskStatus.TASK_STATUS_SUBMITTED]: {
      label: 'Submitted',
      color: '#00008B',
      icon: 'submitting',
    },
    [TaskStatus.TASK_STATUS_DISPATCHED]: {
      label: 'Dispatched',
      color: '#6495ED',
      icon: 'dispatched',
    },
    [TaskStatus.TASK_STATUS_COMPLETED]: {
      label: 'Completed',
      color: '#006400',
      icon: 'success'
    },
    [TaskStatus.TASK_STATUS_ERROR]: {
      label: 'Error',
      color: '#FF0000',
      icon: 'error',
    },
    [TaskStatus.TASK_STATUS_TIMEOUT]: {
      label: 'Timeout',
      color: '#FF0000',
      icon: 'timeout',
    },
    [TaskStatus.TASK_STATUS_CANCELLING]: {
      label: 'Cancelling',
      color: '#696969',
      icon: 'cancelling',
    },
    [TaskStatus.TASK_STATUS_CANCELLED]: {
      label: 'Cancelled',
      color: '#000000',
      icon: 'cancel',
    },
    [TaskStatus.TASK_STATUS_PROCESSING]: {
      label: 'Processing',
      color: '#008000',
      icon: 'play'
    },
    [TaskStatus.TASK_STATUS_PROCESSED]: {
      label: 'Processed',
      color: '#008B8B',
      icon: 'processed'
    },
    [TaskStatus.TASK_STATUS_RETRIED]: {
      label: 'Retried',
      color: '#FF0000',
      icon: 'retry',
    },
    [TaskStatus.TASK_STATUS_PENDING]: {
      label: $localize`Pending`,
      color: '#696969',
      icon: 'pending'
    },
    [TaskStatus.TASK_STATUS_PAUSED]: {
      label: $localize`Paused`,
      color: '#FF8C00',
      icon: 'pause',
    },
  };

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
    || taskStatus === TaskStatus.TASK_STATUS_DISPATCHED || taskStatus === TaskStatus.TASK_STATUS_RETRIED || taskStatus === TaskStatus.TASK_STATUS_PENDING || taskStatus === TaskStatus.TASK_STATUS_PAUSED ;
  }
}
