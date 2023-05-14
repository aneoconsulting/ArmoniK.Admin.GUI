import { PartitionRaw as GrpcPartitionRaw } from '@aneoconsultingfr/armonik.api.angular';
import { Column, Filter, FilterField, ListOptions } from '@app/types/data';

export type PartitionRaw = GrpcPartitionRaw.AsObject;
export type PartitionRawColumn = Column<PartitionRaw>;
export type PartitionRawFilterField = FilterField<PartitionRaw>;
export type PartitionRawFilter = Filter<PartitionRaw>;
export type PartitionRawListOptions = ListOptions<PartitionRaw>;
// Waiting to externalize the sort direction
// type PartitionRawSortDirection = SortDirection<ListPartitionsRequest.OrderDirection>
