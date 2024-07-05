import { ResultsStatusesService } from '@app/results/services/results-statuses.service';
import { SessionsStatusesService } from '@app/sessions/services/sessions-statuses.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { Status } from './data';

export interface StatusesServiceI<S extends Status> {
  readonly statuses: Record<S, string>;
  statusToLabel(status: S): string;
}

export interface CancelStatusesServiceI<S extends Status> extends StatusesServiceI<S> {
  notEnded(taskStatus: S): boolean;
}

export type StatusesService = SessionsStatusesService | TasksStatusesService | ResultsStatusesService;