import { PartitionRaw as GrpcPartitionRaw, PartitionRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { FilterDefinition, FilterFor } from '@app/sessions/services/sessions-filters.service';
import { ColumnKey, FieldKey } from '@app/types/data';
import { Filter, FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';

export type PartitionRaw = GrpcPartitionRaw.AsObject;
export type PartitionRawColumnKey = ColumnKey<PartitionRaw, never> | 'count';
export type PartitionRawFieldKey = FieldKey<PartitionRaw>;
export type PartitionRawListOptions = ListOptions<PartitionRaw>;

export type PartitionFilterField = PartitionRawEnumField;
export type PartitionsFiltersDefinition = FilterDefinition<PartitionRawEnumField>;

export type PartitionFilterFor = FilterFor<PartitionRawEnumField>;
export type PartitionRawFiltersOr = FiltersOr<PartitionRawEnumField>;
export type PartitionRawFilter = Filter<PartitionRawEnumField>;
