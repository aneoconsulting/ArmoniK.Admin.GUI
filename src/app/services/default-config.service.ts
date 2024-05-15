import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { ApplicationRawColumnKey, ApplicationRawFilters, ApplicationRawListOptions } from '@app/applications/types';
import { Line, TasksStatusesGroup } from '@app/dashboard/types';
import { PartitionRawColumnKey, PartitionRawFilters, PartitionRawListOptions } from '@app/partitions/types';
import { ResultRawColumnKey, ResultRawFilters, ResultRawListOptions } from '@app/results/types';
import { SessionRawColumnKey, SessionRawFilters, SessionRawListOptions } from '@app/sessions/types';
import { TaskSummaryColumnKey, TaskSummaryFilters, TaskSummaryListOptions } from '@app/tasks/types';
import { ExportedDefaultConfig, ScopeConfig } from '@app/types/config';
import { ExternalService } from '@app/types/external-service';
import { Sidebar } from '@app/types/navigation';
import { Theme } from '@app/types/themes';

@Injectable()
export class DefaultConfigService {
  readonly #defaultTheme: Theme = 'indigo-pink';
  readonly #defaultExternalServices: ExternalService[] = [];

  readonly #defaultDashboardLines: Line[] = [
    {
      name: $localize`Tasks by statuses`,
      type: 'CountStatus',
      interval: 5,
      hideGroupsHeader: false,
      filters: [],
      taskStatusesGroups: [
        {
          name: $localize`Finished`,
          color: '#00ff00',
          statuses: [
            TaskStatus.TASK_STATUS_COMPLETED,
            TaskStatus.TASK_STATUS_CANCELLED,
          ],
        },
        {
          name: $localize`Running`,
          color: '#ffa500',
          statuses: [
            TaskStatus.TASK_STATUS_PROCESSING,
          ]
        },
        {
          name: $localize`Errors`,
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

  readonly #defaultSidebarOpened: boolean = true;

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
    'divider'
  ];

  readonly #defaultApplications: ScopeConfig<ApplicationRawColumnKey, ApplicationRawListOptions, ApplicationRawFilters> = {
    interval: 10,
    lockColumns: false,
    columns: [
      'name',
      'version',
      'count',
    ],
    options: {
      pageIndex: 0,
      pageSize: 100,
      sort: {
        active: 'name',
        direction: 'asc'
      },
    },
    filters: [],
  };

  readonly #defaultTasksByStatus: TasksStatusesGroup[] = [
    {
      name: 'Completed',
      statuses: [TaskStatus.TASK_STATUS_COMPLETED],
      color: '#4caf50',
    },
    {
      name: 'Error',
      statuses: [TaskStatus.TASK_STATUS_ERROR],
      color: '#ff0000',
    },
    {
      name: 'Timeout',
      statuses: [TaskStatus.TASK_STATUS_TIMEOUT],
      color: '#ff6944',
    },
    {
      name: 'Retried',
      statuses: [TaskStatus.TASK_STATUS_RETRIED],
      color: '#ff9800',
    }
  ];

  readonly #defaultPartitions: ScopeConfig<PartitionRawColumnKey, PartitionRawListOptions, PartitionRawFilters> = {
    interval: 10,
    lockColumns: false,
    columns: [
      'id',
      'count'
    ],
    options: {
      pageIndex: 0,
      pageSize: 100,
      sort: {
        active: 'id',
        direction: 'asc'
      },
    },
    filters: [],
  };

  readonly #defaultSessions: ScopeConfig<SessionRawColumnKey, SessionRawListOptions, SessionRawFilters> = {
    interval: 10,
    lockColumns: false,
    columns: [
      'sessionId',
      'count',
      'actions',
    ],
    options: {
      pageIndex: 0,
      pageSize: 100,
      sort: {
        active: 'createdAt',
        direction: 'desc'
      },
    },
    filters: [],
  };

  readonly #defaultResults: ScopeConfig<ResultRawColumnKey, ResultRawListOptions, ResultRawFilters> = {
    interval: 10,
    lockColumns: false,
    columns: [
      'resultId',
      'sessionId',
    ],
    options: {
      pageIndex: 0,
      pageSize: 100,
      sort: {
        active: 'createdAt',
        direction: 'desc'
      },
    },
    filters: [],
  };

  readonly #defaultTasks: ScopeConfig<TaskSummaryColumnKey, TaskSummaryListOptions, TaskSummaryFilters> = {
    interval: 10,
    lockColumns: false,
    columns: [
      'id',
      'status',
      'submittedAt',
      'actions'
    ],
    options: {
      pageIndex: 0,
      pageSize: 100,
      sort: {
        active: 'createdAt',
        direction: 'desc'
      },
    },
    filters: [],
  };

  readonly #availableLanguages = ['en', 'fr'];
  readonly #defaultLanguage = window.location.href.includes('fr') ? 'fr' : 'en';

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

  get defaultSidebarOpened(): boolean {
    return structuredClone(this.#defaultSidebarOpened);
  }

  get defaultSidebar(): Sidebar[] {
    return structuredClone(this.#defaultSidebar);
  }

  get defaultApplications(): ScopeConfig<ApplicationRawColumnKey, ApplicationRawListOptions, ApplicationRawFilters> {
    return structuredClone(this.#defaultApplications);
  }

  get defaultTasksByStatus(): TasksStatusesGroup[] {
    return structuredClone(this.#defaultTasksByStatus);
  }

  get defaultPartitions(): ScopeConfig<PartitionRawColumnKey, PartitionRawListOptions, PartitionRawFilters> {
    return structuredClone(this.#defaultPartitions);
  }

  get defaultSessions(): ScopeConfig<SessionRawColumnKey, SessionRawListOptions, SessionRawFilters> {
    return structuredClone(this.#defaultSessions);
  }

  get defaultResults(): ScopeConfig<ResultRawColumnKey, ResultRawListOptions, ResultRawFilters> {
    return structuredClone(this.#defaultResults);
  }

  get defaultTasks(): ScopeConfig<TaskSummaryColumnKey, TaskSummaryListOptions, TaskSummaryFilters> {
    return structuredClone(this.#defaultTasks);
  }

  get defaultTasksViewInLogs() {
    return structuredClone(this.#defaultTasksViewInLogs);
  }

  get defaultLanguage() {
    return structuredClone(this.#defaultLanguage);
  }

  get availableLanguages() {
    return structuredClone(this.#availableLanguages);
  }

  readonly #exportedDefaultConfig: ExportedDefaultConfig = {
    'language': this.#defaultLanguage,
    'navigation-sidebar': this.#defaultSidebar,
    'navigation-sidebar-opened': this.#defaultSidebarOpened,
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
    'applications-lock-columns': this.#defaultApplications.lockColumns,
    'partitions-columns': this.#defaultPartitions.columns,
    'partitions-options': this.#defaultPartitions.options,
    'partitions-filters': this.#defaultPartitions.filters,
    'partitions-interval': this.#defaultPartitions.interval,
    'partitions-lock-columns': this.#defaultPartitions.lockColumns,
    'sessions-columns': this.#defaultSessions.columns,
    'sessions-options': this.#defaultSessions.options,
    'sessions-filters': this.#defaultSessions.filters,
    'sessions-interval': this.#defaultSessions.interval,
    'sessions-lock-columns': this.#defaultSessions.lockColumns,
    'results-columns': this.#defaultResults.columns,
    'results-options': this.#defaultResults.options,
    'results-filters': this.#defaultResults.filters,
    'results-interval': this.#defaultResults.interval,
    'results-lock-columns': this.#defaultResults.lockColumns,
    'tasks-columns': this.#defaultTasks.columns,
    'tasks-options': this.#defaultTasks.options,
    'tasks-filters': this.#defaultTasks.filters,
    'tasks-interval': this.#defaultTasks.interval,
    'tasks-view-in-logs': this.#defaultTasksViewInLogs,
    'tasks-lock-columns': this.#defaultTasks.lockColumns,
    'tasks-custom-columns': [],
    'sessions-custom-columns': [],
  };

  get exportedDefaultConfig(): ExportedDefaultConfig {
    return structuredClone(this.#exportedDefaultConfig);
  }
}
