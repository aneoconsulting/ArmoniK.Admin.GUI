import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { StatusService } from '@app/types/status';


@Injectable()
export class TasksStatusesService extends StatusService<TaskStatus> {
  constructor() {
    super('tasks');
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
