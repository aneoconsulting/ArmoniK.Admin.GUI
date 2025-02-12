import { WritableSignal } from '@angular/core';
import { TaskOptions } from '@app/tasks/types';
import { Observable, Subject } from 'rxjs';
import { ArmonikData, DataRaw } from './data';
import { FiltersEnums, FiltersOptionsEnums, FiltersOr } from './filters';

export type GroupConditions<F extends FiltersEnums, FO extends FiltersOptionsEnums | null = null> = {
  name: string;
  conditions: FiltersOr<F, FO>,
}

export type Group<T extends DataRaw, O extends TaskOptions | null = null> = {
  name: WritableSignal<string>;
  opened: boolean;
  total: number;
  page: number;
  refresh$: Subject<void>,
  data: Observable<ArmonikData<T, O>[]>
}