import { KeyValue, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { FilterDefinition, FilterFor } from '@app/types/filter-definition';
import { Filter, FilterInput, FilterInputOutput, FilterInputType, FilterInputValueDate, FilterInputValueString, FilterValueOptions } from '@app/types/filters';
import { FiltersOperationService } from '@services/filters.service';
import { FiltersDialogInputComponent } from './filters-dialog-input.component';

@Component({
  selector: 'app-filters-dialog-filter-field',
  template: `
<span *ngIf="first" i18n="Filter condition">Where</span>
<span *ngIf="!first" i18n="Filter condition">And</span>
<mat-form-field appearance="outline"  subscriptSizing="dynamic">
  <mat-label i18n="Label input">Column</mat-label>
  <mat-select (valueChange)="onFieldChange($event)" [value]="filter.for + '-' + filter.field?.toString()">
    <mat-option *ngFor="let definition of filtersDefinitions; trackBy: trackByField" [value]="definition.for + '-' + definition.field">
      {{ retrieveLabel(definition) }}
    </mat-option>
  </mat-select>
</mat-form-field>

<mat-form-field appearance="outline"  subscriptSizing="dynamic">
  <mat-label i18n="Label input">Operator</mat-label>
  <mat-select (valueChange)="onOperatorChange($event)" [value]="filter.operator?.toString()">
    <mat-option *ngFor="let operator of findOperator(filter) | keyvalue; trackBy: trackByOperator" [value]="operator.key">
      {{ operator.value }}
    </mat-option>
  </mat-select>
</mat-form-field>

<app-filters-dialog-input [input]="findInput(filter)" (valueChange)="onInputChange($event)"></app-filters-dialog-input>
  `,
  styles: [`
:host {
  display: flex;
  flex-direction: row;
  align-items: center;

  gap: 1rem;
}

span {
  min-width: 3rem;
  text-align: end;
}
  `],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    KeyValuePipe,
    MatFormFieldModule,
    MatSelectModule,
    FiltersDialogInputComponent,
  ],
  providers: [
    FiltersOperationService,
  ],
})
export class FiltersDialogFilterFieldComponent<T extends number, U extends number | null = null> {
  @Input({ required: true }) first: boolean;
  @Input({ required: true }) filter: Filter<T, U>;

  #filtersOperationService = inject(FiltersOperationService);
  #dataFiltersService = inject(DATA_FILTERS_SERVICE);

  get filtersDefinitions() {
    return this.#dataFiltersService.retrieveFiltersDefinitions<T, U>();
  }

  retrieveLabel(filterDefinition: FilterDefinition<T, U>) {
    return this.#dataFiltersService.retrieveLabel(filterDefinition.for, filterDefinition.field);
  }

  onFieldChange(event: string) {
    const [for_, key] = event.split('-');
    this.filter.for = for_ as FilterFor<T, U>;
    this.filter.field = Number(key) as T | U;
  }

  onOperatorChange(event: string) {
    this.filter.operator = Number(event);
  }

  onInputChange(event: FilterInputOutput) {
    switch (event.type) {
    case 'string':
      this.filter.value = event.value;
      break;
    case 'number':
      this.filter.value = Number(event.value);
      break;
    }
  }

  findInput(filter: Filter<T, U>): FilterInput {
    const type = this.findType(filter);
    const statuses = this.findStatuses(filter);

    switch (type) {
    case 'string':
      return {
        type: 'string',
        value: filter.value as FilterInputValueString || null
      };
    case 'number': {
      return {
        type: 'number',
        value: Number(filter.value) || null
      };
    }
    case 'array':
      return {
        type: 'string',
        value: filter.value as FilterInputValueString || null
      };
    case 'status':
      return {
        type: 'status',
        value: filter.value as string || null,
        statuses
      };
    case 'date':
      return {
        type: 'date',
        value: filter.value as FilterInputValueDate || null
      };
    default:
      throw new Error(`Unknown type ${type}`);
    }
  }

  findType(filter: Filter<T, U>): FilterInputType {

    if (!filter.field) {
      return 'string';
    }

    const field = this.#findFilterMetadata(filter);

    return field?.type ?? 'string';
  }

  findStatuses(filter: Filter<T, U>): FilterValueOptions {
    if (!filter.field) {
      return [];
    }

    const field = this.#findFilterMetadata(filter);

    if (!field) {
      return [];
    }

    if (field.type !== 'status') {
      return [];
    }

    return field.statuses;
  }

  findOperator(filter: Filter<T, U>) {
    const type = this.findType(filter);
    const operators = this.#filtersOperationService.findOperators(type);
    return operators;
  }

  trackByField(_: number, definition: FilterDefinition<T, U>) {
    return definition.for + definition.field;
  }

  trackByOperator(_: number, operator: KeyValue<string, string>) {
    return operator.key;
  }

  #findFilterMetadata(filter: Filter<T, U>): FilterDefinition<T, U> | null {
    return this.#dataFiltersService.retrieveFiltersDefinitions<T, U>().find(f => f.for === filter.for && f.field === filter.field) ?? null;
  }
}
