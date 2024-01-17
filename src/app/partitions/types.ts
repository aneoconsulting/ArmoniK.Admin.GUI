import { PartitionRaw as GrpcPartitionRaw, PartitionRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { ColumnKey, FieldKey } from '@app/types/data';
import { FilterDefinition, FilterFor } from '@app/types/filter-definition';
import { Filter, FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';

export type PartitionRaw = Omit<GrpcPartitionRaw.AsObject, 'queryParams' | 'filters'>;
export type PartitionRawColumnKey = ColumnKey<PartitionRaw, never> | 'count';
export type PartitionRawFieldKey = FieldKey<PartitionRaw>;
export type PartitionRawListOptions = ListOptions<PartitionRaw>;

export type PartitionFilterField = PartitionRawEnumField;
export type PartitionsFiltersDefinition = FilterDefinition<PartitionRawEnumField>;

export type PartitionFilterFor = FilterFor<PartitionRawEnumField>;
export type PartitionRawFiltersOr = FiltersOr<PartitionRawEnumField>;
export type PartitionRawFilter = Filter<PartitionRawEnumField>;
