import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColumnKey } from '@app/types/data';
import { RefreshButtonComponent } from '@components/refresh-button.component';
import { IconsService } from '@services/icons.service';
import { ActionsToolbarGroupComponent } from './actions-toolbar-group.component';
import { ActionsToolbarComponent } from './actions-toolbar.component';
import { AutoRefreshButtonComponent } from './auto-refresh-button.component';
import { ColumnsButtonComponent } from './columns-button.component';
import { SpinnerComponent } from './spinner.component';

@Component({
  selector: 'app-table-actions-toolbar',
  template: `
<app-actions-toolbar>
  <app-actions-toolbar-group>
    <app-refresh-button [tooltip]="refreshTooltip" (refreshChange)="onRefresh()"> </app-refresh-button>
    <app-spinner *ngIf="loading"> </app-spinner>
  </app-actions-toolbar-group>

  <app-actions-toolbar-group>
    <ng-content select="[extra-buttons-right]"></ng-content>

    <app-auto-refresh-button [intervalValue]="intervalValue" (intervalValueChange)="onIntervalValueChange($event)"> </app-auto-refresh-button>

    <app-columns-button
      [columnsLabels]="columnsLabels"
      [displayedColumns]="displayedColumns"
      [availableColumns]="availableColumns"
      (displayedColumnsChange)="onDisplayedColumnsChange($event)"
    >
    </app-columns-button>

    <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Show more options" i18n-aria-label matTooltip="More Options" i18n-matTooltip>
      <mat-icon aria-hidden="true" [fontIcon]="getIcon('more')"></mat-icon>
    </button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="onResetColumns()">
        <mat-icon aria-hidden="true" [fontIcon]="getIcon('format-clear')"></mat-icon>
        <span i18n>
          Reset Columns
        </span>
      </button>
      <button mat-menu-item (click)="onResetFilters()">
        <mat-icon aria-hidden="true" [fontIcon]="getIcon('layers-clear')"></mat-icon>
        <span i18n>
          Reset Filters
        </span>
      </button>
      <ng-content select="[extra-menu-items]"></ng-content>
    </mat-menu>
  </app-actions-toolbar-group>
</app-actions-toolbar>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [],
  imports: [
    NgIf,
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
export class TableActionsToolbarComponent<T extends object, O extends object> {
  #iconsService = inject(IconsService);

  @Input({ required: true }) loading = false;
  @Input({ required: true }) refreshTooltip = '';
  @Input({ required: true }) intervalValue = 0;
  @Input({ required: true }) columnsLabels: Record<ColumnKey<T, O>, string>;
  @Input({ required: true }) displayedColumns: ColumnKey<T, O>[] = [];
  @Input({ required: true }) availableColumns: ColumnKey<T, O>[] = [];

  @Output() refresh: EventEmitter<void> = new EventEmitter<void>();
  @Output() intervalValueChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() displayedColumnsChange: EventEmitter<ColumnKey<T, O>[]> = new EventEmitter<ColumnKey<T, O>[]>();
  @Output() resetColumns: EventEmitter<void> = new EventEmitter<void>();
  @Output() resetFilters: EventEmitter<void> = new EventEmitter<void>();

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
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
}
