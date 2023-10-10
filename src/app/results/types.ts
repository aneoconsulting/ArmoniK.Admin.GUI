import {ResultRaw as GrpcResultRaw, ResultRawEnumField} from '@aneoconsultingfr/armonik.api.angular';
import { ColumnKey, FieldKey } from '@app/types/data';
import { FilterDefinition, FilterFor } from '@app/types/filter-definition';
import { Filter, FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';

export type ResultRaw = GrpcResultRaw.AsObject;
export type ResultRawColumnKey = ColumnKey<ResultRaw, never>;
export type ResultRawFieldKey = FieldKey<ResultRaw>;
export type ResultRawListOptions = ListOptions<ResultRaw>;

export type ResultFilterField = ResultRawEnumField;
export type ResultsFiltersDefinition = FilterDefinition<ResultRawEnumField>;

export type ResultFilterFor = FilterFor<ResultRawEnumField>;
export type ResultRawFiltersOr = FiltersOr<ResultRawEnumField>;
export type ResultRawFilter = Filter<ResultRawEnumField>;
