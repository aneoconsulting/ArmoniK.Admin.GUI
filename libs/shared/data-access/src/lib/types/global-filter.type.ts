import { TimeFilter } from './time-filter-type';

export interface GlobalFilter {
  applicationName: string;
  applicationVersion: string;
  sessionId: string;
  ownerTaskId: string;
  name: string;
  namespace: string;
  service: string
  version: string;
  status: number;
  createdBefore?: TimeFilter;
  createdAfter?: TimeFilter;
  startedBefore?: TimeFilter;
  startedAfter?: TimeFilter;
  endedBefore?: TimeFilter;
  endedAfter?: TimeFilter;
  closedBefore?: TimeFilter;
  closedAfter?: TimeFilter;
}
