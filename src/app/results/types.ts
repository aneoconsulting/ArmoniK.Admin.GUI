import {ResultRaw as GrpcResultRaw} from '@aneoconsultingfr/armonik.api.angular';
import { Column, Filter, FilterField, ListOptions } from '@app/types/data';

export type ResultRaw = GrpcResultRaw.AsObject;
export type ResultRawColumn = Column<ResultRaw>;
// We need to find a way to use filter field for _after and for _before
export type ResultRawFilterField = FilterField<ResultRaw>;
export type ResultRawFilter = Filter<ResultRaw>;
export type ResultRawListOptions = ListOptions<ResultRaw>;
// Waiting to externalize the sort direction
// type ResultRawSortDirection = SortDirection<ListResultsRequest.OrderDirection>
