import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, Subject } from 'rxjs';
import { Column, Filter, FilterField, ListOptions } from './data';

export interface AppIndexComponent<T extends object> extends OnInit, AfterViewInit
{
  // Columns
  displayedColumns: Column<T>[];
  availableColumns: Column<T>[];

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

  // Lifecycle hooks
  ngOnInit(): void;
  ngAfterViewInit(): void;

  // Toolbar methods
  onRefresh(): void;
  onIntervalValueChange(value: number): void;
  onColumnsChange(columns: Column<T>[]): void;
  onColumnsReset(): void;
  onFiltersChange(filters: Filter<T>[]): void;
  onFiltersReset(): void;
  autoRefreshTooltip(): string;

  // Table methods
  onDrop(event: CdkDragDrop<string[]>): void;

  // Miscellaneous methods
  handleAutoRefreshStart(): void;
}
