import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { ApplicationRawColumnKey, ApplicationRawFilter, ApplicationRawListOptions } from '@app/applications/types';
import { TasksStatusesGroup } from '@app/dashboard/types';
import { PartitionRawColumnKey, PartitionRawFilter, PartitionRawListOptions } from '@app/partitions/types';
import { ResultRawColumnKey, ResultRawFilter, ResultRawListOptions } from '@app/results/types';
import { SessionRawColumnKey, SessionRawFilter, SessionRawListOptions } from '@app/sessions/types';
import { TaskStatusColored } from '@app/types/dialog';
import { ExternalService } from '@app/types/external-service';
import { Sidebar } from '@app/types/navigation';
import { Theme } from '@app/types/themes';

type DefaultConfig<C, O, F> = {
  interval: number;
  columns: C[];
  options: O;
  filters: F[];
};

@Injectable()
export class DefaultConfigService {
  readonly #defaultTheme: Theme = 'indigo-pink';
  readonly #defaultExternalServices: ExternalService[] = [];

  readonly #defaultDashboardHideGroupsHeader = false;
  readonly #defaultDashboardInterval = 5;
  readonly #defaultDashboardStatusGroups: TasksStatusesGroup[] = [
    {
      name: 'Finished',
      color: '#00ff00',
      statuses: [
        TaskStatus.TASK_STATUS_COMPLETED,
        TaskStatus.TASK_STATUS_CANCELLED,
      ]
    },
    {
      name: 'Running',
      color: '#ffa500',
      statuses: [
        TaskStatus.TASK_STATUS_PROCESSING,
      ]
    },
    {
      name: 'Errors',
      color: '#ff0000',
      statuses: [
        TaskStatus.TASK_STATUS_ERROR,
        TaskStatus.TASK_STATUS_TIMEOUT,
      ]
    },
  ];

  readonly #defaultSidebar: Sidebar[] = [
    'profile',
    'divider',
    'dashboard',
    'divider',
    'applications',
    'partitions',
    'divider',
    'sessions',
    'results',
    'divider',
    'settings',
    'divider'
  ];

  readonly #defaultApplications: DefaultConfig<ApplicationRawColumnKey, ApplicationRawListOptions, ApplicationRawFilter> = {
    interval: 10,
    columns: [
      'name',
      'version',
      'count',
    ],
    options: {
      pageIndex: 0,
      pageSize: 10,
      sort: {
        active: 'name',
        direction: 'asc'
      },
    },
    filters: [],
  };

  readonly #defaultTasksByStatus: TaskStatusColored[] = [
    {
      status: TaskStatus.TASK_STATUS_COMPLETED,
      color: '#4caf50',
    },
    {
      status: TaskStatus.TASK_STATUS_ERROR,
      color: '#ff0000',
    },
    {
      status: TaskStatus.TASK_STATUS_TIMEOUT,
      color: '#ff6944',
    },
    {
      status: TaskStatus.TASK_STATUS_RETRIED,
      color: '#ff9800',
    },
  ];

  readonly #defaultPartitions: DefaultConfig<PartitionRawColumnKey, PartitionRawListOptions, PartitionRawFilter> = {
    interval: 10,
    columns: [
      'id',
      'actions',
    ],
    options: {
      pageIndex: 0,
      pageSize: 10,
      sort: {
        active: 'id',
        direction: 'asc'
      },
    },
    filters: [],
  };

  readonly #defaultSessions: DefaultConfig<SessionRawColumnKey, SessionRawListOptions, SessionRawFilter> = {
    interval: 10,
    columns: [
      'sessionId',
      'count',
      'actions',
    ],
    options: {
      pageIndex: 0,
      pageSize: 10,
      sort: {
        active: 'sessionId',
        direction: 'asc'
      },
    },
    filters: [],
  };

  readonly #defaultResults: DefaultConfig<ResultRawColumnKey, ResultRawListOptions, ResultRawFilter> = {
    interval: 10,
    columns: [
      'name',
      'actions',
    ],
    options: {
      pageIndex: 0,
      pageSize: 10,
      sort: {
        active: 'name',
        direction: 'asc'
      },
    },
    filters: [],
  };

  // We use getters to be able to deep copy the default config and to access the default config from the outside

  get defaultTheme(): Theme {
    return structuredClone(this.#defaultTheme);
  }

  get defaultExternalServices(): ExternalService[] {
    return structuredClone(this.#defaultExternalServices);
  }

  get defaultDashboardHideGroupsHeader(): boolean {
    return structuredClone(this.#defaultDashboardHideGroupsHeader);
  }

  get defaultDashboardInterval(): number {
    return structuredClone(this.#defaultDashboardInterval);
  }

  get defaultDashboardStatusGroups(): TasksStatusesGroup[] {
    return structuredClone(this.#defaultDashboardStatusGroups);
  }

  get defaultSidebar(): Sidebar[] {
    return structuredClone(this.#defaultSidebar);
  }

  get defaultApplications(): DefaultConfig<ApplicationRawColumnKey, ApplicationRawListOptions, ApplicationRawFilter> {
    return structuredClone(this.#defaultApplications);
  }

  get defaultTasksByStatus(): TaskStatusColored[] {
    return structuredClone(this.#defaultTasksByStatus);
  }

  get defaultPartitions(): DefaultConfig<PartitionRawColumnKey, PartitionRawListOptions, PartitionRawFilter> {
    return structuredClone(this.#defaultPartitions);
  }

  get defaultSessions(): DefaultConfig<SessionRawColumnKey, SessionRawListOptions, SessionRawFilter> {
    return structuredClone(this.#defaultSessions);
  }

  get defaultResults(): DefaultConfig<ResultRawColumnKey, ResultRawListOptions, ResultRawFilter> {
    return structuredClone(this.#defaultResults);
  }
}
