import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ColumnKey } from '@app/types/data';
import { Filter, FilterField } from '@app/types/filters';
import { FiltersChipsComponent } from '@components/filters-chips.component';
import { FiltersDialogComponent } from '@components/filters-dialog.component';

@Component({
  selector: 'app-filters-toolbar',
  template: `
<div class="filters-toolbar">
  <app-filters-chips *ngIf="showFilters()" [filters]="filters" [filtersFields]="filtersFields" [columnsLabels]="columnsLabels">
    </app-filters-chips>

    <button mat-button (click)="openFiltersDialog()">
      <mat-icon aria-hidden="true" fontIcon="add"></mat-icon>
      <span i18n="User will be able the create or delete filters">Manage filters</span>
    </button>
</div>
  `,
  styles: [`
.filters-toolbar {
  display: flex;
  flex-direction: row;
  align-items: center;
}

app-filters-chips + button {
  margin-left: 1rem;
}
  `],
  standalone: true,
  providers: [],
  imports: [
    NgIf,
    FiltersChipsComponent,
    FiltersDialogComponent,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ]
})
export class FiltersToolbarComponent<T extends object> {
  @Input({ required: true }) filters: Filter<T>[] = [];
  @Input({ required: true }) filtersFields: FilterField<T>[] = [];
  @Input({ required: true }) columnsLabels: Record<ColumnKey<T>, string> | null = null;

  @Output() filtersChange: EventEmitter<Filter<T>[]> = new EventEmitter<Filter<T>[]>();

  constructor(
    private _dialog: MatDialog
  ) {}

  showFilters(): boolean {
    return  this.filters.length > 1 || (this.filters[0]?.value !== null && this.filters.length === 1);
  }

  openFiltersDialog(): void {
    const dialogRef = this._dialog.open(FiltersDialogComponent, {
      data: {
        filters: Array.from(this.filters),
        availableFiltersFields: Array.from(this.filtersFields),
        columnsLabels: this.columnsLabels,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) {
        return;
      }

      this.filtersChange.emit(result);
    });
  }
}
