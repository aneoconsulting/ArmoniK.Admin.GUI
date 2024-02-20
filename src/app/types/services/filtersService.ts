import { ApplicationFilterField, ApplicationFilterFor, ApplicationsFiltersDefinition } from '@app/applications/types';
import { FiltersEnums, FiltersOptionsEnums } from '@app/dashboard/types';
import { PartitionFilterField, PartitionFilterFor, PartitionsFiltersDefinition } from '@app/partitions/types';
import { ResultsStatusesService } from '@app/results/services/results-statuses.service';
import { ResultFilterField, ResultFilterFor, ResultsFiltersDefinition } from '@app/results/types';
import { SessionsStatusesService } from '@app/sessions/services/sessions-statuses.service';
import { SessionFilterDefinition, SessionFilterField, SessionFilterFor } from '@app/sessions/types';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { TaskFilterDefinition, TaskFilterField, TaskFilterFor } from '@app/tasks/types';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { RawFilters } from '../filters';

type StatusesService = TasksStatusesService | ResultsStatusesService | SessionsStatusesService;
export type FilterFor = TaskFilterFor | ResultFilterFor | SessionFilterFor | PartitionFilterFor | ApplicationFilterFor;
export type FilterField = TaskFilterField | ResultFilterField | SessionFilterField | PartitionFilterField | ApplicationFilterField;
export type FilterDefinition = TaskFilterDefinition | SessionFilterDefinition | ResultsFiltersDefinition | PartitionsFiltersDefinition | ApplicationsFiltersDefinition;

export interface FiltersServiceInterface<F extends RawFilters, I extends FilterFor, T extends FilterField, D extends FilterDefinition, E extends FiltersEnums> {
  defaultConfigService: DefaultConfigService;
  tableService: TableService;

  readonly rootField: Record<E, string>;
  readonly filtersDefinitions: D[];

  defaultFilters: F;

  saveFilters(filters: F): void;
  restoreFilters(): F;

  resetFilters(): F;

  retrieveLabel(filterFor: I, filterField: T): string;

  retrieveFiltersDefinitions(): D[];

  retrieveField(filterField: string): T;
}

export interface FiltersServiceOptionsInterface<F extends RawFilters, I extends FilterFor, T extends FilterField, D extends FilterDefinition, E extends FiltersEnums, O extends NonNullable<FiltersOptionsEnums>> extends FiltersServiceInterface<F, I, T, D, E> {
  readonly optionsField: Record<O, string>;
}

export interface FiltersServiceStatusesInterface {
  readonly statusService: StatusesService;
}