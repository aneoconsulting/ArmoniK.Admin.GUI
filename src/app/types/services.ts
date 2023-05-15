import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { ColumnKey, FieldKey } from './data';
import { Filter, FilterField } from './filters';
import { ListOptions } from './options';

export interface AppGrpcService<T extends object> {
  readonly sortDirections: Record<SortDirection, number>
  readonly sortFields: Record<FieldKey<T>, number>

  list$(options: ListOptions<T>, filters: Filter<T>[]): Observable<unknown>
  get$(id: string): Observable<unknown>
}

export interface AppIndexService<T extends object> {
  readonly tableName: string

  readonly defaultColumns: ColumnKey<T>[]
  readonly availableColumns: ColumnKey<T>[]

  readonly defaultIntervalValue: number

  readonly defaultOptions: ListOptions<T>

  readonly defaultFilters: Filter<T>[]
  readonly availableFiltersFields: FilterField<T>[]
  // TODO: add on AppGrpcService (or create a shared class for both)
  // readonly sortDirections: SortDirection
  // readonly sortFields: Record<Column<T>, number>

  // Miscellaneous
  generateSharableURL(options: ListOptions<T>, filters: Filter<T>[]): string
  // Interval
  saveIntervalValue(value: number): void
  restoreIntervalValue(): number
  // Columns
  saveColumns(columns: ColumnKey<T>[]): void
  restoreColumns(): ColumnKey<T>[]
  resetColumns(): void
  // Options
  saveOptions(options: ListOptions<T>): void
  restoreOptions(): ListOptions<T>
  // Filters
  saveFilters(filters: Filter<T>[]): void
  restoreFilters(): Filter<T>[]
  resetFilters(): void
}
