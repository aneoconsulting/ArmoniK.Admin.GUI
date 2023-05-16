import { ApplicationRaw as GrpcApplicationRaw } from '@aneoconsultingfr/armonik.api.angular';
import { ColumnKey, FieldKey } from '@app/types/data';
import { Filter, FilterField } from '@app/types/filters';
import { ListOptions } from '@app/types/options';

// TODO: rename type in order to have the same order that generics
export type ApplicationRaw = GrpcApplicationRaw.AsObject;
export type ApplicationRawColumn = ColumnKey<ApplicationRaw>;
export type ApplicationRawKeyField = FieldKey<ApplicationRaw>;
export type ApplicationRawFilterField = FilterField<ApplicationRaw>;
export type ApplicationRawFilter = Filter<ApplicationRaw>;
export type ApplicationRawListOptions = ListOptions<ApplicationRaw>;
// Waiting to externalize the sort direction
// type ApplicationRawSortDirection = SortDirection<ListApplicationsRequest.OrderDirection>
