import { Subject } from 'rxjs';
import { ArmonikData, DataRaw } from './data';

export type TableType = 'Applications' | 'Tasks' | 'Sessions' | 'Partitions' | 'Results';

export type ActionTable<T extends DataRaw> = {
  icon: string;
  label: string;
  action$: Subject<ArmonikData<T>>;
  condition?: (element: ArmonikData<T>) => boolean;
};