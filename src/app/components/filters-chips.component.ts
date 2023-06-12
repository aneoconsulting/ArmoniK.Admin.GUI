import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { ColumnKey, FieldKey } from '@app/types/data';
import { Filter, FilterField, FilterFieldSelect } from '@app/types/filters';

@Component({
  selector: 'app-filters-chips',
  template: `
<mat-chip-listbox>
  <ng-container *ngFor="let filter of filters; let index = index; trackBy:trackByFilter">
    <mat-chip class="mat-mdc-standard-chip mat-primary mat-mdc-chip-selected">
      <span *ngIf="filter.field;else noField"> {{ content(filter) }} </span>
    </mat-chip>
  </ng-container>
</mat-chip-listbox>

<ng-template #noField>
  <span i18n>No field</span>
</ng-template>
  `,
  styles: [`
  `],
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatChipsModule,
  ]
})
export class FiltersChipsComponent<T extends object> {
  @Input({ required: true }) filters: Filter<T>[] = [];
  @Input({ required: true }) filtersFields: FilterField<T>[] = [];
  @Input({ required: true }) columnsLabels: Record<ColumnKey<T>, string> | null = null;

  content(filter: Filter<T>): string {
    if (!filter.value)
      return $localize`No value`;

    if (filter.value instanceof Object)
      return this.columnToLabel(filter.field) + '=' + $localize`from ` + filter.value.start + $localize` to ` + filter.value.end;

    if (this.#isSelectFilter(filter)) {
      const options = (this.filtersFields.find(field => field.field === filter.field) as FilterFieldSelect<T>).options;

      const option = options.find(option => option.value === filter.value);
      return this.columnToLabel(filter.field) + '=' + option?.label ?? filter.value;
    }


    return this.columnToLabel(filter.field) + '=' + filter.value;
  }

  columnToLabel(column: FieldKey<T> | null): string {
    if (column === null)
      return '';

    if (this.columnsLabels === null)
      return column.toString();
    else
      return this.columnsLabels[column];
  }

  trackByFilter(_: number, filter: Filter<T>): string {
    return (filter.field as string) ?? '';
  }

  #isSelectFilter(filter: Filter<T>): boolean {
    return this.filtersFields.find(field => field.field === filter.field)?.type === 'select';
  }
}
