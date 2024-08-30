import { ApplicationFilterField, ApplicationFilterFor, ApplicationsFiltersDefinition } from '@app/applications/types';
import { PartitionFilterField, PartitionFilterFor, PartitionsFiltersDefinition } from '@app/partitions/types';
import { ResultsStatusesService } from '@app/results/services/results-statuses.service';
import { ResultFilterField, ResultFilterFor, ResultsFiltersDefinition } from '@app/results/types';
import { SessionsStatusesService } from '@app/sessions/services/sessions-statuses.service';
import { SessionFilterDefinition, SessionFilterField, SessionFilterFor } from '@app/sessions/types';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { TaskFilterDefinition, TaskFilterField, TaskFilterFor } from '@app/tasks/types';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { FiltersEnums, FiltersOptionsEnums, FiltersOr } from '../filters';

type StatusesService = TasksStatusesService | ResultsStatusesService | SessionsStatusesService;
export type FilterFor = TaskFilterFor | ResultFilterFor | SessionFilterFor | PartitionFilterFor | ApplicationFilterFor;
export type FilterField = TaskFilterField | ResultFilterField | SessionFilterField | PartitionFilterField | ApplicationFilterField;
export type FilterDefinition = TaskFilterDefinition | SessionFilterDefinition | ResultsFiltersDefinition | PartitionsFiltersDefinition | ApplicationsFiltersDefinition;

export interface FiltersServiceInterface<F extends FiltersEnums, O extends FiltersOptionsEnums | null = null> {
  defaultConfigService: DefaultConfigService;
  tableService: TableService;

  readonly rootField: Record<F, string>;
  readonly filtersDefinitions: FilterDefinition[];

  defaultFilters: FiltersOr<F, O>;

  saveFilters(filters: FiltersOr<F, O>): void;
  restoreFilters(): FiltersOr<F, O>;

  resetFilters(): FiltersOr<F, O>;
  
  saveShowFilters(showFilters: boolean): void;
  restoreShowFilters(): boolean;

  retrieveLabel(filterFor: FilterFor, filterField: FilterField): string;
}

export interface FiltersServiceOptionsInterface<F extends FiltersEnums, O extends NonNullable<FiltersOptionsEnums>> extends FiltersServiceInterface<F, O> {
  readonly optionsFields: Record<O, string>;
}

export interface FiltersServiceStatusesInterface {
  readonly statusService: StatusesService;
}