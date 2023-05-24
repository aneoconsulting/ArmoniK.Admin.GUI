import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColumnKey } from '@app/types/data';
import { RefreshButtonComponent } from '@components/refresh-button.component';
import { ActionsToolbarGroupComponent } from './actions-toolbar-group.component';
import { ActionsToolbarComponent } from './actions-toolbar.component';
import { AutoRefreshButtonComponent } from './auto-refresh-button.component';
import { ColumnsButtonComponent } from './columns-button.component';

@Component({
  selector: 'app-table-actions-toolbar',
  template: `
<app-actions-toolbar>
  <app-actions-toolbar-group>
    <app-refresh-button [tooltip]="refreshTooltip" (refreshChange)="onRefresh()"> </app-refresh-button>
  </app-actions-toolbar-group>

  <app-actions-toolbar-group>
    <app-auto-refresh-button [intervalValue]="intervalValue" (intervalValueChange)="onIntervalValueChange($event)"> </app-auto-refresh-button>

    <app-columns-button [displayedColumns]="displayedColumns" [availableColumns]="availableColumns" (displayedColumnsChange)="onDisplayedColumnsChange($event)"> </app-columns-button>

    <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Show more options">
      <mat-icon aria-hidden="true" fontIcon="more_vert"></mat-icon>
    </button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="onResetColumns()" i18n>Reset Columns</button>
      <button mat-menu-item (click)="onResetFilters()" i18n>Reset Filters</button>
      <!-- Currently, it's impossible to reset sort programmatically. -->
    </mat-menu>
  </app-actions-toolbar-group>
</app-actions-toolbar>
  `,
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
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
  ]
})
export class TableActionsToolbarComponent<T extends object> {
  @Input({ required: true }) refreshTooltip = '';
  @Input({ required: true }) intervalValue = 0;
  @Input({ required: true }) displayedColumns: ColumnKey<T>[] = [];
  @Input({ required: true }) availableColumns: ColumnKey<T>[] = [];

  @Output() refresh: EventEmitter<void> = new EventEmitter<void>();
  @Output() intervalValueChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() displayedColumnsChange: EventEmitter<ColumnKey<T>[]> = new EventEmitter<ColumnKey<T>[]>();
  @Output() resetColumns: EventEmitter<void> = new EventEmitter<void>();
  @Output() resetFilters: EventEmitter<void> = new EventEmitter<void>();

  onRefresh(): void {
    this.refresh.emit();
  }

  onIntervalValueChange(value: number): void {
    this.intervalValueChange.emit(value);
  }

  onDisplayedColumnsChange(value: ColumnKey<T>[]): void {
    this.displayedColumnsChange.emit(value);
  }

  onResetColumns(): void {
    this.resetColumns.emit();
  }

  onResetFilters(): void {
    this.resetFilters.emit();
  }
}
