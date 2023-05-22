import { PartitionRaw as GrpcPartitionRaw } from '@aneoconsultingfr/armonik.api.angular';
import { ColumnKey, FieldKey } from '@app/types/data';
import { Filter, FilterField } from '@app/types/filters';
import { ListOptions } from '@app/types/options';

export type PartitionRaw = GrpcPartitionRaw.AsObject;
export type PartitionRawColumnKey = ColumnKey<PartitionRaw>;
export type PartitionRawFieldKey = FieldKey<PartitionRaw>;
export type PartitionRawFilterField = FilterField<PartitionRaw>;
export type PartitionRawFilter = Filter<PartitionRaw>;
export type PartitionRawListOptions = ListOptions<PartitionRaw>;
// Waiting to externalize the sort direction
// type PartitionRawSortDirection = SortDirection<ListPartitionsRequest.OrderDirection>
