import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskOptions } from '@app/tasks/types';
import { TableColumn } from '@app/types/column.type';
import { ColumnKey, CustomColumn, DataRaw } from '@app/types/data';
import { RefreshButtonComponent } from '@components/refresh-button.component';
import { IconsService } from '@services/icons.service';
import { ActionsToolbarGroupComponent } from './actions-toolbar-group.component';
import { ActionsToolbarComponent } from './actions-toolbar.component';
import { AutoRefreshButtonComponent } from './auto-refresh-button.component';
import { ColumnsButtonComponent } from './columns-button.component';
import { SpinnerComponent } from './spinner.component';

@Component({
  selector: 'app-table-actions-toolbar',
  templateUrl: './table-actions-toolbar.component.html',
  styles: [`
  `],
  standalone: true,
  providers: [],
  imports: [
    RefreshButtonComponent,
    AutoRefreshButtonComponent,
    ColumnsButtonComponent,
    ActionsToolbarComponent,
    ActionsToolbarGroupComponent,
    SpinnerComponent,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
  ]
})
export class TableActionsToolbarComponent<T extends DataRaw, O extends TaskOptions | null = null> {
  private readonly iconsService = inject(IconsService);

  @Input({ required: true }) loading = false;
  @Input({ required: true }) refreshTooltip = '';
  @Input({ required: true }) intervalValue = 0;
  @Input({ required: true }) columnsLabels: Record<ColumnKey<T, O>, string>;
  @Input({ required: true }) displayedColumns: ColumnKey<T, O>[] = [];
  @Input({ required: true }) availableColumns: TableColumn<T, O>[] = [];
  @Input({ required: false }) customColumns: CustomColumn[];
  @Input({ required: true }) lockColumns = false;

  @Output() refresh: EventEmitter<void> = new EventEmitter<void>();
  @Output() intervalValueChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() displayedColumnsChange: EventEmitter<ColumnKey<T, O>[]> = new EventEmitter<ColumnKey<T, O>[]>();
  @Output() resetColumns: EventEmitter<void> = new EventEmitter<void>();
  @Output() resetFilters: EventEmitter<void> = new EventEmitter<void>();
  @Output() lockColumnsChange = new EventEmitter<void>();

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  onRefresh(): void {
    this.refresh.emit();
  }
  
  onIntervalValueChange(value: number): void {
    this.intervalValueChange.emit(value);
  }

  onDisplayedColumnsChange(data: ColumnKey<T, O>[]): void {
    this.displayedColumnsChange.emit(data);
  }

  onResetColumns(): void {
    this.resetColumns.emit();
  }

  onResetFilters(): void {
    this.resetFilters.emit();
  }

  onLockColumnsChange(): void {
    this.lockColumnsChange.emit();
  }
}
