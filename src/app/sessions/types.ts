import {SessionRaw as GrpcSessionRaw} from '@aneoconsultingfr/armonik.api.angular';
import { ColumnKey, FieldKey } from '@app/types/data';
import { Filter, FilterField } from '@app/types/filters';
import { ListOptions } from '@app/types/options';

export type SessionRaw = GrpcSessionRaw.AsObject;
export type SessionRawColumnKey = ColumnKey<SessionRaw>;
// We need to find a way to use filter field for _after and for _before
export type SessionRawFieldKey = FieldKey<SessionRaw>;
export type SessionRawFilterField = FilterField<SessionRaw>;
export type SessionRawFilter = Filter<SessionRaw>;
export type SessionRawListOptions = ListOptions<SessionRaw>;
// Waiting to externalize the sort direction
// type ResultRawSortDirection = SortDirection<ListResultsRequest.OrderDirection>
