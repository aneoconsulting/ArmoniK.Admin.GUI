import { TaskOptions } from '@app/tasks/types';
import { ArmonikData, DataRaw } from './data';
import { FiltersEnums, FiltersOptionsEnums, FiltersOr } from './filters';

export type GroupConditions<F extends FiltersEnums, FO extends FiltersOptionsEnums | null = null> = {
  name: string;
  conditions: FiltersOr<F, FO>,
}

export type Group<T extends DataRaw, O extends TaskOptions | null = null> = {
  name: string;
  opened: boolean;
  data: ArmonikData<T, O>[]
}