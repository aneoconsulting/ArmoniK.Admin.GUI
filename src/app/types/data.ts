import { ApplicationRaw } from '@app/applications/types';
import { PartitionRaw } from '@app/partitions/types';
import { ResultRaw } from '@app/results/types';
import { SessionRaw } from '@app/sessions/types';
import { TaskRaw } from '@app/tasks/types';

export type PrefixedOptions<T> = `options.${keyof T extends string ? keyof T : never}`;

export type ColumnKey<T extends object, O extends object = Record<string, never>> = keyof T | 'actions' | PrefixedOptions<O>;

export type FieldKey<T extends object> = keyof T;

export type DataRaw = SessionRaw | ApplicationRaw | PartitionRaw | ResultRaw | TaskRaw;