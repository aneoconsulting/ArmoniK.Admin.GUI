import { Component, EventEmitter, Input, Output, ViewContainerRef, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomColumn } from '@app/types/data';
import { FiltersDialogData, FiltersDialogResult } from '@app/types/dialog';
import { FiltersOr } from '@app/types/filters';
import { FiltersChipsComponent } from '@components/filters/filters-chips.component';
import { IconsService } from '@services/icons.service';
import { FiltersDialogComponent } from './filters-dialog.component';

@Component({
  selector: 'app-filters-toolbar',
  templateUrl: './filters-toolbar.component.html',
  styles: [`
.filters-toolbar {
  display: flex;
  flex-direction: row;
}

.filters-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filters-list-text {
  font-size: 1rem;
  font-weight: 400;

  min-width: 3rem;
  text-align: end;
}

.filters-list-and {
  display: flex;
  flex-direction: row;
  align-items: center;

  gap: 0.5rem;
}

button {
  align-self: flex-start;
}

.manage-filters {
  height: 4rem;
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
}

.manage-filters mat-icon {
  transform: scale(1.5);
}
  `],
  standalone: true,
  imports: [
    FiltersChipsComponent,
    FiltersDialogComponent,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
  ],
})
export class FiltersToolbarComponent<T extends number, U extends number | null = null> {
  #iconsService = inject(IconsService);
  #dialog = inject(MatDialog);
  #viewContainerRef = inject(ViewContainerRef);

  hasFilters = false;
  hasOneOrFilter = false;

  private _filters: FiltersOr<T, U> = [];
  
  @Input({ required: true }) set filters(entry: FiltersOr<T, U>) {
    this._filters = entry;
    this.setHasFilters();
    this.setHasOneOrFilter();
  }
  
  get filters(): FiltersOr<T, U> {
    return this._filters;
  }

  @Input() customColumns: CustomColumn[] | undefined;
  @Input() showFilters = true;

  @Output() filtersChange: EventEmitter<FiltersOr<T, U>> = new EventEmitter<FiltersOr<T, U>>();
  @Output() showFiltersChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

  toggleShow(): void {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }

  setHasOneOrFilter(): void {
    this.hasOneOrFilter = this.filters.length === 1;
  }

  setHasFilters(): void {
    this.hasFilters = false;
    let i = 0;
    while (i !== this.filters.length && !this.hasFilters) {
      if (this.filters[i]?.length !== 0) {
        this.hasFilters = true;
      }
      i++;
    }
  }

  openFiltersDialog(): void {
    const dialogRef = this.#dialog.open<FiltersDialogComponent<T, U>, FiltersDialogData<T, U>, FiltersDialogResult<T, U>>(FiltersDialogComponent, {
      data: {
        filtersOr: Array.from(this.filters),
        customColumns: this.customColumns
      },
      // @see https://www.jeffryhouser.com/index.cfm/2021/9/28/Why-wont-my-MatDialog-Inject-my-Service to understand issue solved here.
      viewContainerRef: this.#viewContainerRef,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        if (this.isFilterNull(result)) {
          this.filters = [];
        } else {
          this.filters = result;
        }
        this.setHasFilters();
        this.setHasOneOrFilter();
        this.filtersChange.emit(this.filters);
      }
    });
  }

  isFilterNull(result: FiltersDialogResult<T, U>): boolean {
    return result[0][0].field === null && result[0][0].for === null && result[0][0].operator === null && result[0][0].value === null;
  }
}
