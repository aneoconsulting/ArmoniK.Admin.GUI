import { NgFor, NgIf } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { Filter, FiltersAnd } from '@app/types/filters';
import { FiltersService } from '@services/filters.service';
import { UtilsService } from '@services/utils.service';

@Component({
  selector: 'app-filters-chips',
  template: `
<mat-chip-listbox>
   <ng-container *ngFor="let filter of filtersAnd; let last = last; trackBy:trackByFilter">
    <mat-chip class="mat-mdc-standard-chip mat-primary mat-mdc-chip-selected">
      <span *ngIf="filter.field;else noField"> {{ content(filter) }} </span>
    </mat-chip>
    <span class="text" *ngIf="!last">AND</span>
  </ng-container>
</mat-chip-listbox>

<ng-template #noField>
  <span i18n>No field</span>
</ng-template>
  `,
  styles: [`
.text {
  font-size: 1rem;
  font-weight: 400;

  margin-top: auto;
  margin-bottom: auto;

  margin-left: 8px;
}
  `],
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatChipsModule,
  ],
  providers: [
    FiltersService,
  ],
})
export class FiltersChipsComponent<T extends number, U extends number | null = null> {
  #filtersService = inject(FiltersService);
  #utilsService = inject(UtilsService<T, U>);
  #dataFiltersService = inject(DATA_FILTERS_SERVICE);

  @Input({ required: true }) filtersAnd: FiltersAnd<T, U> = [];

  content(filter: Filter<T, U>): string {

    if(!filter.for) {
      filter.for = 'root';
    }

    const label = this.#dataFiltersService.retrieveLabel(filter.for, Number(filter.field));

    if (!filter.value)
      return label + ' ' + $localize`has no value`;

    const filtersDefinitions = this.#dataFiltersService.retrieveFiltersDefinitions();
    const type = this.#utilsService.recoverType(filter, filtersDefinitions);
    const operator = this.#filtersService.findOperators(type)[filter.operator as number];

    if (type === 'status') {
      const statuses = this.#utilsService.recoverStatuses(filter, filtersDefinitions);
      const status = statuses.find(s => s.key.toString() === filter.value?.toString());
      return `${label} ${operator} ${status?.value}`;
    }

    return `${label} ${operator} ${filter.value}`;
  }

  trackByFilter(_: number, filter: Filter<T, U>): string {
    return filter.field?.toString() ?? '';
  }
}
