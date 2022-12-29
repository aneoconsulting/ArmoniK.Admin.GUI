import { ListApplicationsRequest } from '../proto/generated/applications-common.pb';
import { ListResultsRequest } from '../proto/generated/results-common.pb';
import { ListSessionsRequest } from '../proto/generated/sessions-common.pb';
import { ListTasksRequest } from '../proto/generated/tasks-common.pb';

export type GlobalFilter = {
  applicationsFilter: ListApplicationsRequest.Filter;
  resultsFilter: ListResultsRequest.Filter;
  sessionsFilter: ListSessionsRequest.Filter;
  tasksFilter: ListTasksRequest.Filter;
};
