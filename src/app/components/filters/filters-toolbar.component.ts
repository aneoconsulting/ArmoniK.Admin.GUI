import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewContainerRef, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FiltersDialogData, FiltersDialogResult } from '@app/types/dialog';
import { FiltersAnd, FiltersOr } from '@app/types/filters';
import { FiltersChipsComponent } from '@components/filters/filters-chips.component';
import { IconsService } from '@services/icons.service';
import { FiltersDialogComponent } from './filters-dialog.component';

@Component({
  selector: 'app-filters-toolbar',
  template: `
<div class="filters-toolbar">
  <ng-container  *ngFor="let filtersAnd of filters; let first = first; trackBy: trackByFilter">
    <div class="filters-toolbar-and">
      <span class="filters-toolbar-text" *ngIf="first">
        Where
      </span>
      <span class="filters-toolbar-text" *ngIf="!first">
        OR
      </span>
      <app-filters-chips [filtersAnd]="filtersAnd"></app-filters-chips>
    </div>
  </ng-container>

  <button mat-button (click)="openFiltersDialog()" matTooltip="Add or Remove Filters" i18n-matTooltip>
    <mat-icon aria-hidden="true" [fontIcon]="getIcon('add')"></mat-icon>
    <span i18n="User will be able the create or delete filters">Manage filters</span>
  </button>
</div>
  `,
  styles: [`
.filters-toolbar {
  display: flex;
  flex-direction: column;

  gap: 0.5rem;
}

.filters-toolbar-text {
  font-size: 1rem;
  font-weight: 400;

  min-width: 3rem;
  text-align: end;
}

.filters-toolbar-and {
  display: flex;
  flex-direction: row;
  align-items: center;

  gap: 0.5rem;
}

button {
  align-self: flex-start;
}
  `],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
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

  @Input({ required: true }) filters: FiltersOr<T, U> = [];

  @Output() filtersChange: EventEmitter<FiltersOr<T, U>> = new EventEmitter<FiltersOr<T, U>>();

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

  showFilters(): boolean {
    return true;
    // return  this.filters.length > 1 || (this.filters[0]?.value !== null && this.filters.length === 1);
  }

  openFiltersDialog(): void {
    const dialogRef = this.#dialog.open<FiltersDialogComponent<T, U>, FiltersDialogData<T, U>, FiltersDialogResult<T, U>>(FiltersDialogComponent, {
      data: {
        filtersOr: Array.from(this.filters),
      },
      // @see https://www.jeffryhouser.com/index.cfm/2021/9/28/Why-wont-my-MatDialog-Inject-my-Service to understand issue solved here.
      viewContainerRef: this.#viewContainerRef,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) {
        return;
      }

      this.filtersChange.emit(result);
    });
  }

  trackByFilter(index: number, filtersAnd: FiltersAnd<T, U>) {
    return index + filtersAnd.length;
  }
}
