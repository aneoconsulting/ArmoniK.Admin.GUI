import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColumnKey } from '@app/types/data';
import { Filter, FilterField } from '@app/types/filters';
import { FiltersChipsComponent } from '@components/filters-chips.component';
import { FiltersDialogComponent } from '@components/filters-dialog.component';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-filters-toolbar',
  template: `
<div class="filters-toolbar">
  <app-filters-chips *ngIf="showFilters()" [filters]="filters" [filtersFields]="filtersFields" [columnsLabels]="columnsLabels">
    </app-filters-chips>

    <button mat-button (click)="openFiltersDialog()" matTooltip="Add or Remove Filters" i18n-matTooltip>
      <mat-icon aria-hidden="true" [fontIcon]="getIcon('add')"></mat-icon>
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
    MatTooltipModule,
  ]
})
export class FiltersToolbarComponent<T extends object> {
  #iconsService = inject(IconsService);

  @Input({ required: true }) filters: Filter<T>[] = [];
  @Input({ required: true }) filtersFields: FilterField<T>[] = [];
  @Input({ required: true }) columnsLabels: Record<ColumnKey<T>, string> | null = null;

  @Output() filtersChange: EventEmitter<Filter<T>[]> = new EventEmitter<Filter<T>[]>();

  constructor(
    private _dialog: MatDialog
  ) {}

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

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
