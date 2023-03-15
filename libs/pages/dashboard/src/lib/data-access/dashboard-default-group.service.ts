import { Injectable } from '@angular/core';
import { Group } from '../types/group.type';
import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';

@Injectable()
export class DashboardDefaultGroupService {
  public readonly defaultGroups: Group[] = [
    {
      name: 'Unspecified',
      color: 'grey',
      items: [
        {
          value: 0,
          id: TaskStatus.TASK_STATUS_UNSPECIFIED,
          name: 'unspecified',
        },
      ],
    },
    {
      name: 'In progress',
      color: 'orange',
      items: [
        {
          value: 0,
          id: TaskStatus.TASK_STATUS_CREATING,
          name: 'creating',
        },
        {
          value: 0,
          id: TaskStatus.TASK_STATUS_SUBMITTED,
          name: 'submitted',
        },
        {
          value: 0,
          id: TaskStatus.TASK_STATUS_DISPATCHED,
          name: 'dispatched',
        },
      ],
    },
    {
      name: 'Running',
      color: 'yellow',
      items: [
        {
          value: 0,
          id: TaskStatus.TASK_STATUS_PROCESSING,
          name: 'processing',
        },
        {
          value: 0,
          id: TaskStatus.TASK_STATUS_PROCESSED,
          name: 'processed',
        },
      ],
    },
    {
      name: 'Completed',
      color: 'green',
      items: [
        {
          value: 0,
          id: TaskStatus.TASK_STATUS_COMPLETED,
          name: 'completed',
        },
      ],
    },
    {
      name: 'Cancelled',
      color: 'amber',
      items: [
        {
          value: 0,
          id: TaskStatus.TASK_STATUS_CANCELLING,
          name: 'cancelling',
        },
        {
          value: 0,
          id: TaskStatus.TASK_STATUS_CANCELLED,
          name: 'cancelled',
        },
      ],
    },
    {
      name: 'Failed',
      color: 'red',
      items: [
        {
          value: 0,
          id: TaskStatus.TASK_STATUS_TIMEOUT,
          name: 'timeout',
        },
        {
          value: 0,
          id: TaskStatus.TASK_STATUS_ERROR,
          name: 'error',
        },
      ],
    },
  ];
}
