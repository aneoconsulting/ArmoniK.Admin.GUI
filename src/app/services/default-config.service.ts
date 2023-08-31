import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { ApplicationRawColumnKey, ApplicationRawFilter, ApplicationRawListOptions } from '@app/applications/types';
import { Line } from '@app/dashboard/types';
import { PartitionRawColumnKey, PartitionRawFiltersOr, PartitionRawListOptions } from '@app/partitions/types';
import { ResultRawColumnKey, ResultRawFiltersOr, ResultRawListOptions } from '@app/results/types';
import { SessionRawColumnKey, SessionRawFiltersOr, SessionRawListOptions } from '@app/sessions/types';
import { TaskSummaryColumnKey, TaskSummaryFiltersOr, TaskSummaryListOptions } from '@app/tasks/types';
import { ExportedDefaultConfig, ScopeConfig } from '@app/types/config';
import { TaskStatusColored } from '@app/types/dialog';
import { ExternalService } from '@app/types/external-service';
import { Sidebar } from '@app/types/navigation';
import { Theme } from '@app/types/themes';

@Injectable()
export class DefaultConfigService {
  readonly #defaultTheme: Theme = 'indigo-pink';
  readonly #defaultExternalServices: ExternalService[] = [];

  readonly #defaultDashboardLines: Line[] = [
    {
      name: 'Tasks by status',
      interval: 5,
      hideGroupsHeader: false,
      filters: [],
      taskStatusesGroups: [
        {
          name: 'Finished',
          color: '#00ff00',
          statuses: [
            TaskStatus.TASK_STATUS_COMPLETED,
            TaskStatus.TASK_STATUS_CANCELLED,
          ],
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
      ],
    }
  ];
  readonly #defaultDashboardSplitLines: number = 1;



  readonly #defaultSidebar: Sidebar[] = [
    'profile',
    'divider',
    'dashboard',
    'divider',
    'applications',
    'partitions',
    'divider',
    'sessions',
    'tasks',
    'results',
    'divider',
    'settings',
    'divider'
  ];

  readonly #defaultApplications: ScopeConfig<ApplicationRawColumnKey, ApplicationRawListOptions, ApplicationRawFilter> = {
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

  readonly #defaultPartitions: ScopeConfig<PartitionRawColumnKey, PartitionRawListOptions, PartitionRawFiltersOr> = {
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

  readonly #defaultSessions: ScopeConfig<SessionRawColumnKey, SessionRawListOptions, SessionRawFiltersOr> = {
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

  readonly #defaultResults: ScopeConfig<ResultRawColumnKey, ResultRawListOptions, ResultRawFiltersOr> = {
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

  readonly #defaultTasks: ScopeConfig<TaskSummaryColumnKey, TaskSummaryListOptions, TaskSummaryFiltersOr> = {
    interval: 10,
    columns: [
      'id',
      'status',
      'submittedAt',
      'actions'
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

  readonly #defaultTasksViewInLogs = {
    serviceName: null,
    serviceIcon: null,
    urlTemplate: null,
  };

  // We use getters to be able to deep copy the default config and to access the default config from the outside

  get defaultTheme(): Theme {
    return structuredClone(this.#defaultTheme);
  }

  get defaultExternalServices(): ExternalService[] {
    return structuredClone(this.#defaultExternalServices);
  }

  get defaultDashboardLines(): Line[] {
    return structuredClone(this.#defaultDashboardLines);
  }

  get defaultDashboardSplitLines(): number {
    return structuredClone(this.#defaultDashboardSplitLines);
  }

  get defaultSidebar(): Sidebar[] {
    return structuredClone(this.#defaultSidebar);
  }

  get defaultApplications(): ScopeConfig<ApplicationRawColumnKey, ApplicationRawListOptions, ApplicationRawFilter> {
    return structuredClone(this.#defaultApplications);
  }

  get defaultTasksByStatus(): TaskStatusColored[] {
    return structuredClone(this.#defaultTasksByStatus);
  }

  get defaultPartitions(): ScopeConfig<PartitionRawColumnKey, PartitionRawListOptions, PartitionRawFiltersOr> {
    return structuredClone(this.#defaultPartitions);
  }

  get defaultSessions(): ScopeConfig<SessionRawColumnKey, SessionRawListOptions, SessionRawFiltersOr> {
    return structuredClone(this.#defaultSessions);
  }

  get defaultResults(): ScopeConfig<ResultRawColumnKey, ResultRawListOptions, ResultRawFiltersOr> {
    return structuredClone(this.#defaultResults);
  }

  get defaultTasks(): ScopeConfig<TaskSummaryColumnKey, TaskSummaryListOptions, TaskSummaryFiltersOr> {
    return structuredClone(this.#defaultTasks);
  }

  get defaultTasksViewInLogs() {
    return structuredClone(this.#defaultTasksViewInLogs);
  }

  readonly #exportedDefaultConfig: ExportedDefaultConfig = {
    'navigation-sidebar': this.#defaultSidebar,
    'navigation-theme': this.#defaultTheme,
    'navigation-external-services': this.#defaultExternalServices,
    'applications-tasks-by-status': this.#defaultTasksByStatus,
    'sessions-tasks-by-status': this.#defaultTasksByStatus,
    'dashboard-lines': this.#defaultDashboardLines,
    'dashboard-split-lines': this.#defaultDashboardSplitLines,
    'partitions-tasks-by-status': this.#defaultTasksByStatus,
    'applications-columns': this.#defaultApplications.columns,
    'applications-options': this.#defaultApplications.options,
    'applications-filters': this.#defaultApplications.filters,
    'applications-interval': this.#defaultApplications.interval,
    'partitions-columns': this.#defaultPartitions.columns,
    'partitions-options': this.#defaultPartitions.options,
    'partitions-filters': this.#defaultPartitions.filters,
    'partitions-interval': this.#defaultPartitions.interval,
    'sessions-columns': this.#defaultSessions.columns,
    'sessions-options': this.#defaultSessions.options,
    'sessions-filters': this.#defaultSessions.filters,
    'sessions-interval': this.#defaultSessions.interval,
    'results-columns': this.#defaultResults.columns,
    'results-options': this.#defaultResults.options,
    'results-filters': this.#defaultResults.filters,
    'results-interval': this.#defaultResults.interval,
    'tasks-columns': this.#defaultTasks.columns,
    'tasks-options': this.#defaultTasks.options,
    'tasks-filters': this.#defaultTasks.filters,
    'tasks-interval': this.#defaultTasks.interval,
    'tasks-view-in-logs': this.#defaultTasksViewInLogs,
  };

  get exportedDefaultConfig(): ExportedDefaultConfig {
    return structuredClone(this.#exportedDefaultConfig);
  }
}
