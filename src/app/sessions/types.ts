import { ColumnKey, FieldKey } from '@app/types/data';
import { Filter, FilterField } from '@app/types/filters';
import { ListOptions } from '@app/types/options';

// FIXME: use the correct SessionRaw
export type SessionRaw =  {
  sessionId: string;
  status: number;
  partitionsIds: string[];
  options: Record<string, string>;
  createdAt: string;
  cancelledAt: string;
  startedAt: string;
  applicationName: string;
  applicationVersion: string;
};
export type SessionRawColumnKey = ColumnKey<SessionRaw>;
// We need to find a way to use filter field for _after and for _before
export type SessionRawFieldKey = FieldKey<SessionRaw>;
export type SessionRawFilterField = FilterField<SessionRaw>;
export type SessionRawFilter = Filter<SessionRaw>;
export type SessionRawListOptions = ListOptions<SessionRaw>;
// Waiting to externalize the sort direction
// type ResultRawSortDirection = SortDirection<ListResultsRequest.OrderDirection>
