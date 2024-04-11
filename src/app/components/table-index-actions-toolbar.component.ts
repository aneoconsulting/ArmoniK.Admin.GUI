import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ColumnKey, RawColumnKey } from '@app/types/data';
import { TableActionsToolbarComponent } from './table-actions-toolbar.component';

@Component({
  selector: 'app-table-index-actions-toolbar',
  templateUrl: './table-index-actions-toolbar.component.html',
  standalone: true,
  imports: [
    TableActionsToolbarComponent,
  ]
})
export class TableIndexActionsToolbarComponent<T extends object, O extends object> {
  @Input({ required: true }) loading = false;
  @Input({ required: true }) refreshTooltip = '';
  @Input({ required: true }) intervalValue = 0;
  @Input({ required: true }) columnsLabels: Record<ColumnKey<T, O>, string>;
  @Input({ required: true }) displayedColumns: RawColumnKey[] = [];
  @Input({ required: true }) availableColumns: RawColumnKey[] = [];
  @Input({ required: true }) lockColumns = false;

  @Output() refresh: EventEmitter<void> = new EventEmitter<void>();
  @Output() intervalValueChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() displayedColumnsChange: EventEmitter<ColumnKey<T, O>[]> = new EventEmitter<ColumnKey<T, O>[]>();
  @Output() resetColumns: EventEmitter<void> = new EventEmitter<void>();
  @Output() resetFilters: EventEmitter<void> = new EventEmitter<void>();
  @Output() lockColumnsChange = new EventEmitter<void>();

  onRefresh(): void {
    this.refresh.emit();
  }

  onIntervalValueChange(value: number): void {
    this.intervalValueChange.emit(value);
  }

  onColumnsChange(columns: ColumnKey<T, O>[]): void {
    this.displayedColumnsChange.emit(columns);
  }

  onColumnsReset(): void {
    this.resetColumns.emit();
  }

  onFiltersReset(): void {
    this.resetFilters.emit();
  }

  onLockColumnsChange(): void {
    this.lockColumnsChange.emit();
  }
}