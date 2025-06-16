import { TaskOptions } from '@app/tasks/types';
import { ColumnKey, DataRaw } from '@app/types/data';

export type CheckedColumn<T extends DataRaw, O extends TaskOptions | null = null> = {
  column: ColumnKey<T, O>;
  checked: boolean;
}