import { Subject } from 'rxjs';
import { ArmonikDataType } from './data';

export type ActionTable<T extends ArmonikDataType> = {
  icon: string;
  label: string;
  action$: Subject<T>;
  condition?: (element: T) => boolean;
};