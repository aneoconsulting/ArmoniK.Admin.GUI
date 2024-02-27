import { Subject } from 'rxjs';
import { ArmonikData, DataRaw } from './data';

export type ActionTable<T extends ArmonikData<DataRaw>> = {
  icon: string;
  label: string;
  action$: Subject<T>;
  condition?: (element: T) => boolean;
};