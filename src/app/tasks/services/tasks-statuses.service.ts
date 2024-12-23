import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { StatusLabelColor, StatusService } from '@app/types/status';


@Injectable()
export class TasksStatusesService extends StatusService<TaskStatus> {
  readonly statuses: Record<TaskStatus, StatusLabelColor> = {
    [TaskStatus.TASK_STATUS_UNSPECIFIED]: {
      label: 'Unspecified',
      color: 'darkgrey'
    },
    [TaskStatus.TASK_STATUS_CREATING]: {
      label: 'Creating',
      color: 'darkcyan',
      icon: 'add',
    },
    [TaskStatus.TASK_STATUS_SUBMITTED]: {
      label: 'Submitted',
      color: 'darkblue',
      icon: 'submitting',
    },
    [TaskStatus.TASK_STATUS_DISPATCHED]: {
      label: 'Dispatched',
      color: 'cornflowerblue',
      icon: 'dispatched',
    },
    [TaskStatus.TASK_STATUS_COMPLETED]: {
      label: 'Completed',
      color: 'darkgreen',
      icon: 'success'
    },
    [TaskStatus.TASK_STATUS_ERROR]: {
      label: 'Error',
      color: 'red',
      icon: 'error',
    },
    [TaskStatus.TASK_STATUS_TIMEOUT]: {
      label: 'Timeout',
      color: 'red',
      icon: 'timeout',
    },
    [TaskStatus.TASK_STATUS_CANCELLING]: {
      label: 'Cancelling',
      color: 'grey',
      icon: 'cancelling',
    },
    [TaskStatus.TASK_STATUS_CANCELLED]: {
      label: 'Cancelled',
      color: 'black',
      icon: 'cancel',
    },
    [TaskStatus.TASK_STATUS_PROCESSING]: {
      label: 'Processing',
      color: 'green',
      icon: 'play'
    },
    [TaskStatus.TASK_STATUS_PROCESSED]: {
      label: 'Processed',
      color: 'darkcyan',
      icon: 'processed'
    },
    [TaskStatus.TASK_STATUS_RETRIED]: {
      label: 'Retried',
      color: 'red',
      icon: 'retry',
    },
    [TaskStatus.TASK_STATUS_PENDING]: {
      label: $localize`Pending`,
      color: 'grey',
      icon: 'pending'
    },
    [TaskStatus.TASK_STATUS_PAUSED]: {
      label: $localize`Paused`,
      color: 'darkorange',
      icon: 'pause',
    },
  };

  statusesRecord(): { value: string, name: StatusLabelColor }[] {
    const values = Object.values(this.statuses).map(status => status.label).sort((a, b) => a.toString().localeCompare(b.toString()));
    const keys = Object.keys(this.statuses).sort((a, b) => a.toString().localeCompare(b.toString()));
    const sortedKeys = values.map((value) => {
      return keys.find((key) => {
        return this.statuses[Number(key) as TaskStatus].label === value;
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
