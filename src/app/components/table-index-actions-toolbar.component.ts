import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ColumnKey, RawColumnKey } from '@app/types/data';
import { IconsService } from '@services/icons.service';
import { TableActionsToolbarComponent } from './table-actions-toolbar.component';

@Component({
  selector: 'app-table-index-actions-toolbar',
  templateUrl: './table-index-actions-toolbar.component.html',
  standalone: true,
  imports: [
    TableActionsToolbarComponent,
    MatMenuModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableIndexActionsToolbarComponent<T extends object, O extends object> {
  readonly iconsService = inject(IconsService);

  @Input({ required: true }) loading: boolean;
  @Input({ required: true }) refreshTooltip: string;
  @Input({ required: true }) intervalValue: number;
  @Input({ required: true }) columnsLabels: Record<ColumnKey<T, O>, string>;
  @Input({ required: true }) displayedColumns: RawColumnKey[];
  @Input({ required: true }) availableColumns: RawColumnKey[];
  @Input({ required: true }) lockColumns = false;

  @Output() refresh: EventEmitter<void> = new EventEmitter<void>();
  @Output() intervalValueChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() displayedColumnsChange: EventEmitter<ColumnKey<T, O>[]> = new EventEmitter<ColumnKey<T, O>[]>();
  @Output() resetColumns: EventEmitter<void> = new EventEmitter<void>();
  @Output() resetFilters: EventEmitter<void> = new EventEmitter<void>();
  @Output() lockColumnsChange = new EventEmitter<void>();
  @Output() addToDashboard = new EventEmitter<void>();

  getIcon(value: string): string {
    return this.iconsService.getIcon(value);
  }

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

  onAddToDashboard(): void {
    this.addToDashboard.emit();
  }
}