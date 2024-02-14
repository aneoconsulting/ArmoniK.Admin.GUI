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
  id: string;
  name: string;
  icon?: string;
  disabled?: boolean;
  link?: string;
  color?: 'accent' | 'primary';
  queryParams?: { [x: string]: string; };
  area?: 'left' | 'right';
  action$?: Subject<void>;
};


export interface AppShowComponent<T extends object> {
  id: string;
  sharableURL: string;
  refresh: Subject<void>
  data: T | null;
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

export interface TaskShowComponent extends AppShowComponent<TaskRaw> {
  _tasksStatusesService: TasksStatusesService;
  _filtersService: FiltersService;
  cancel$: Subject<void>;

  cancelTask(): void;
  canCancel(): boolean;
}

export interface SessionShowComponent extends AppShowComponent<SessionRaw> {
  _sessionsStatusesService: SessionsStatusesService;
  _filtersService: FiltersService;
  cancel$: Subject<void>;

  cancelSession(): void;
  canCancel(): boolean;
}

export interface ResultShowComponent extends AppShowComponent<ResultRaw> {
  _resultsStatusesService: ResultsStatusesService;
}

export interface PartitionShowComponent extends AppShowComponent<PartitionRaw> {
  _filtersService: FiltersService;
}