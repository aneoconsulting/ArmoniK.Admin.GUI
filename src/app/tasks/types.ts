import { StatusCount as GrpcStatusCount, TaskOptions as GrpcTaskOptions } from '@aneoconsultingfr/armonik.api.angular';
import { PrefixedOptions } from '@app/types/data';

export type StatusCount = GrpcStatusCount.AsObject;
export type TaskOptions = GrpcTaskOptions.AsObject;
export type PrefixedTaskOptions = PrefixedOptions<TaskOptions>;
