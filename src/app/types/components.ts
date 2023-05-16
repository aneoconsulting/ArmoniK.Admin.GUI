import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, Subject, Subscription } from 'rxjs';
import { ColumnKey } from './data';
import { Filter, FilterField } from './filters';
import { ListOptions } from './options';

export interface AppIndexComponent<T extends object> extends OnInit, AfterViewInit, OnDestroy
{
  // Columns
  displayedColumns: ColumnKey<T>[];
  availableColumns: ColumnKey<T>[];

  // Data
  isLoading: boolean;
  data: T[];
  total: number;

  // Options
  options: ListOptions<T>;

  // Filters
  filters: Filter<T>[];
  availableFiltersFields: FilterField<T>[];

  // Miscellaneous
  intervalValue: number;
  sharableURL: string;

  // Subjects and Observables
  refresh: Subject<void>;
  stopInterval: Subject<void>;
  interval: Subject<number>;
  interval$: Observable<number>;
  sort: MatSort;
  paginator: MatPaginator;

  subscriptions: Subscription;

  // Lifecycle hooks
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;

  // Toolbar methods
  onRefresh(): void;
  onIntervalValueChange(value: number): void;
  onColumnsChange(columns: ColumnKey<T>[]): void;
  onColumnsReset(): void;
  onFiltersChange(filters: Filter<T>[]): void;
  onFiltersReset(): void;
  autoRefreshTooltip(): string;

  // Table methods
  onDrop(event: CdkDragDrop<string[]>): void;

  // Miscellaneous methods
  handleAutoRefreshStart(): void;
}

export interface AppShowComponent<T extends object> {
  data: T | null;
}
