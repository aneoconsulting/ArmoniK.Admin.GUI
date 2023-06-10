import { ApplicationRaw as GrpcApplicationRaw, StatusCount as GrpcStatusCount  } from '@aneoconsultingfr/armonik.api.angular';
import { ColumnKey, FieldKey } from '@app/types/data';
import { Filter, FilterField } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { QueryParamsFilterKey } from '@app/types/query-params';

export type ApplicationRaw = GrpcApplicationRaw.AsObject;
export type ApplicationRawColumnKey = ColumnKey<ApplicationRaw> | 'count';
export type ApplicationRawFieldKey = FieldKey<ApplicationRaw>;
export type ApplicationRawFilterField = FilterField<ApplicationRaw>;
export type ApplicationRawFilter = Filter<ApplicationRaw>;
export type ApplicationRawListOptions = ListOptions<ApplicationRaw>;

export type ApplicationRawQueryParamsFilterKey = QueryParamsFilterKey<ApplicationRaw>;

export type StatusCount = GrpcStatusCount.AsObject;
