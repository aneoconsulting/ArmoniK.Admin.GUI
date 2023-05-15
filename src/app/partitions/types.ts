import { PartitionRaw as GrpcPartitionRaw } from '@aneoconsultingfr/armonik.api.angular';
import { ColumnKey, FieldKey } from '@app/types/data';
import { Filter, FilterField } from '@app/types/filters';
import { ListOptions } from '@app/types/options';

// TODO: rename type in order to have the same order that generics
export type PartitionRaw = GrpcPartitionRaw.AsObject;
export type PartitionRawColumn = ColumnKey<PartitionRaw>;
export type PartitionRawKeyField = FieldKey<PartitionRaw>;
export type PartitionRawFilterField = FilterField<PartitionRaw>;
export type PartitionRawFilter = Filter<PartitionRaw>;
export type PartitionRawListOptions = ListOptions<PartitionRaw>;
// Waiting to externalize the sort direction
// type PartitionRawSortDirection = SortDirection<ListPartitionsRequest.OrderDirection>
