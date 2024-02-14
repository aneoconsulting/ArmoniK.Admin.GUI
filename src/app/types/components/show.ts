import { ResultStatus, SessionStatus, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { PartitionRaw } from '@app/partitions/types';
import { ResultsStatusesService } from '@app/results/services/results-statuses.service';
import { ResultRaw } from '@app/results/types';
import { SessionsStatusesService } from '@app/sessions/services/sessions-statuses.service';
import { SessionRaw } from '@app/sessions/types';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { TaskRaw } from '@app/tasks/types';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { Page } from '../pages';
import { GrpcService } from '../services';

export type ShowActionButton = {
  name: string;
  icon?: string;
  disabled?: boolean;
  link?: string;
  color?: 'accent' | 'primary';
  queryParams?: { [x: string]: string; };
  area?: 'left' | 'right';
  action?: () => void;
};

type showActionTaskData = {
  sessionId: string;
  partitionId: string;
  resultsQueryParams: {[key: string]: string};
  taskStatus: TaskStatus;
};

export type showActionSessionData = {
  partitionQueryParams: {[key: string]: string};
  resultsQueryParams: {[key: string]: string};
  tasksQueryParams: {[key: string]: string};
};

export type showActionPartitionData = {
  sessionsQueryParams: {[key: string]: string};
  tasksQueryParams: {[key: string]: string};
};

export type showActionResultData = {
  sessionId: string;
  ownerTaskId: string;
};

type showActionData = showActionTaskData | showActionPartitionData | showActionSessionData | showActionResultData;

export interface AppShowComponent<T extends object, E extends showActionData> {
  id: string;
  sharableURL: string;
  refresh: Subject<void>
  data: T | null;
  actionData: E;
  actionButtons: ShowActionButton[];

  _iconsService: IconsService;
  _grpcService: GrpcService;
  _shareURLService: ShareUrlService;
  _notificationService: NotificationService
  _route: ActivatedRoute;

  getIcon(name: string): string;
  getPageIcon(page: Page): string;
  onRefresh(): void;
}

export interface TaskShowComponent extends AppShowComponent<TaskRaw, showActionTaskData> {
  _tasksStatusesService: TasksStatusesService;
  _filtersService: FiltersService;

  get statuses(): Record<TaskStatus, string>;

  cancelTasks(): void;
  canCancel(): boolean;
}

export interface SessionShowComponent extends AppShowComponent<SessionRaw, showActionSessionData> {
  _sessionsStatusesService: SessionsStatusesService;
  _filtersService: FiltersService;

  get statuses(): Record<SessionStatus, string>;

  cancelSessions(): void;
  canCancel(): boolean;
}

export interface ResultShowComponent extends AppShowComponent<ResultRaw, showActionResultData> {
  _resultsStatusesService: ResultsStatusesService;

  get statuses(): Record<ResultStatus, string>;
}

export interface PartitionShowComponent extends AppShowComponent<PartitionRaw, showActionPartitionData> {
  _filtersService: FiltersService;
}