import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RefreshButtonComponent } from '@components/refresh-button.component';
import { Column } from '@app/types/data';
import { AutoRefreshButtonComponent } from './auto-refresh-button.component';
import { ColumnsButtonComponent } from './columns-button.component';

@Component({
  selector: 'app-actions-toolbar',
  template: `
<div class="actions-toolbar">
  <div class="buttons">
    <app-refresh-button [tooltip]="refreshTooltip" (refreshChange)="onRefresh()"> </app-refresh-button>
  </div>

  <div class="buttons">
    <app-auto-refresh-button [intervalValue]="intervalValue" (intervalValueChange)="onIntervalValueChange($event)"> </app-auto-refresh-button>

    <app-columns-button [displayedColumns]="displayedColumns" [availableColumns]="availableColumns" (displayedColumnsChange)="onDisplayedColumnsChange($event)"> </app-columns-button>

    <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Show more options">
      <mat-icon aria-hidden="true" fontIcon="more_vert"></mat-icon>
    </button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="onResetColumns()">Reset Columns</button>
      <button mat-menu-item (click)="onResetFilters()">Reset Filters</button>
      <!-- Currently, it's impossible to reset sort programmatically. -->
    </mat-menu>
  </div>
</div>
  `,
  styles: [`
.actions-toolbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.buttons > * + * {
  margin-left: 1rem;
}

.buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
}
  `],
  standalone: true,
  providers: [],
  imports: [
    RefreshButtonComponent,
    AutoRefreshButtonComponent,
    ColumnsButtonComponent,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
  ]
})
export class ActionsToolbarComponent<T extends object> {
  @Input({ required: true }) refreshTooltip = '';
  @Input({ required: true }) intervalValue = 0;
  @Input({ required: true }) displayedColumns: Column<T>[] = [];
  @Input({ required: true }) availableColumns: Column<T>[] = [];

  @Output() refresh: EventEmitter<void> = new EventEmitter<void>();
  @Output() intervalValueChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() displayedColumnsChange: EventEmitter<Column<T>[]> = new EventEmitter<Column<T>[]>();
  @Output() resetColumns: EventEmitter<void> = new EventEmitter<void>();
  @Output() resetFilters: EventEmitter<void> = new EventEmitter<void>();

  onRefresh(): void {
    this.refresh.emit();
  }

  onIntervalValueChange(value: number): void {
    this.intervalValueChange.emit(value);
  }

  onDisplayedColumnsChange(value: Column<T>[]): void {
    this.displayedColumnsChange.emit(value);
  }

  onResetColumns(): void {
    this.resetColumns.emit();
  }

  onResetFilters(): void {
    this.resetFilters.emit();
  }
}
