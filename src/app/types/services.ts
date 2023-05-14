import { GrpcMessage } from '@ngx-grpc/common';
import { Observable } from 'rxjs';
import { Column, Filter, FilterField, ListOptions } from './data';

export interface AppGrpcService<T extends object> {

  list$(options: ListOptions<T>, filters: Filter<T>[]): Observable<unknown>
  // TODO: verify the get and the params
  get$(id: string): GrpcMessage
}

export interface AppIndexService<T extends object> {
  readonly tableName: string

  readonly defaultColumns: Column<T>[]
  readonly availableColumns: Column<T>[]

  readonly defaultIntervalValue: number

  readonly defaultOptions: ListOptions<T>

  readonly defaultFilters: Filter<T>[]
  readonly availableFiltersFields: FilterField<T>[]
  // TODO: add on AppGrpcService (or create a shared class for both)
  // readonly sortDirections: SortDirection
  // readonly sortFields: Record<Column<T>, number>

  // Miscellaneous
  generateSharableURL(options: ListOptions<T>): string
  // Interval
  saveIntervalValue(value: number): void
  restoreIntervalValue(): number
  // Columns
  saveColumns(columns: Column<T>[]): void
  restoreColumns(): Column<T>[]
  resetColumns(): void
  // Options
  saveOptions(options: ListOptions<T>): void
  restoreOptions(): ListOptions<T>
  // Filters
  saveFilters(filters: Filter<T>[]): void
  restoreFilters(): Filter<T>[]
  resetFilters(): void
}
