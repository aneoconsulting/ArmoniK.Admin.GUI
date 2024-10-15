import { TaskOptions } from '@app/tasks/types';
import { Subject } from 'rxjs';
import { ArmonikData, DataRaw } from './data';

export type TableType = 'Applications' | 'Tasks' | 'Sessions' | 'Partitions' | 'Results';

export type ActionTable<T extends DataRaw, O extends TaskOptions | null = null> = {
  icon: string;
  label: string;
  action$: Subject<ArmonikData<T, O>>;
  condition?: (element: ArmonikData<T, O>) => boolean;
};