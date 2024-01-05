import { FilterNumberOperator } from '@aneoconsultingfr/armonik.api.angular';
import { AsyncPipe, KeyValue, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, map, startWith } from 'rxjs';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { GenericColumn } from '@app/types/data';
import { FilterDefinition, FilterFor } from '@app/types/filter-definition';
import { Filter, FilterInput, FilterInputOutput, FilterInputType, FilterInputValueDuration, FilterInputValueString, FilterValueOptions, MaybeNull } from '@app/types/filters';
import { FiltersService } from '@services/filters.service';
import { FiltersDialogInputComponent } from './filters-dialog-input.component';

@Component({
  selector: 'app-filters-dialog-filter-field',
  template: `
<span *ngIf="first" i18n="Filter condition">Where</span>
<span *ngIf="!first" i18n="Filter condition">And</span>
<mat-form-field *ngIf="filter.for !== 'generic'" appearance="outline" subscriptSizing="dynamic">
  <mat-label i18n="Label input">Property</mat-label>
  <mat-select (valueChange)="onFieldChange($event)" [value]="filter.for + '-' + filter.field?.toString()">
    <mat-option *ngFor="let definition of filtersDefinitions; trackBy: trackByField" [value]="definition.for + '-' + definition.field">
      {{ retrieveLabel(definition) }}
    </mat-option>
  </mat-select>
</mat-form-field>

<mat-form-field *ngIf="filter.for === 'generic'" appearance="outline" subscriptSizing="dynamic">
  <mat-label i18n="Label input">Generic</mat-label>
  <input type="text" matInput [matAutocomplete]="autoGeneric" [formControl]="genericFormControl" (input)="onGenericFieldChange()">
  <mat-autocomplete #autoGeneric (optionSelected)="onGenericFieldChange()">
    <mat-option *ngFor="let column of filteredGenerics | async" [value]="retrieveGenericLabel(column)">
      {{ retrieveGenericLabel(column) }}
    </mat-option>
  </mat-autocomplete>
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
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  providers: [
    FiltersService,
  ],
})
export class FiltersDialogFilterFieldComponent<T extends number, U extends number | null = null> implements OnInit {
  @Input({ required: true }) first: boolean;
  @Input({ required: true }) filter: Filter<T, U>;
  @Input() genericColumns: GenericColumn[] | undefined;

  genericFormControl: FormControl<string | null>;
  filteredGenerics: Observable<GenericColumn[]>;

  #filtersService = inject(FiltersService);
  #dataFiltersService = inject(DATA_FILTERS_SERVICE);

  ngOnInit(): void {
    if (this.genericColumns) {
      this.genericFormControl = new FormControl(this.genericLabelFromField(this.filter.field as MaybeNull<string>) || '');
      this.filteredGenerics = this.genericFormControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterGenerics(value))
      );
    }
  }

  private _filterGenerics(value: MaybeNull<string>): GenericColumn[] {
    if (this.genericColumns) {
      if (value === null) {
        return this.genericColumns;
      } else {
        const formValue = value.toLowerCase();
        return this.genericColumns.filter(generic => generic.replace('generic.','').toLowerCase().includes(formValue));
      }
    }
    return [];
  }

  get filtersDefinitions() {
    return this.#dataFiltersService.retrieveFiltersDefinitions<T, U>();
  }

  retrieveGenericLabel(genericColumn: GenericColumn) {
    return genericColumn.replace('generic.', '');
  }

  genericLabelFromField(genericField: MaybeNull<string>): string | undefined {
    return genericField ? genericField.replace('generic.', '') : undefined;
  }

  retrieveLabel(filterDefinition: FilterDefinition<T, U>) {
    return this.#dataFiltersService.retrieveLabel(filterDefinition.for, filterDefinition.field);
  }

  onFieldChange(event: string) {
    const [for_, key] = event.split('-');
    this.filter.for = for_ as FilterFor<T, U>;
    this.filter.field = Number(key) as T | U;
  }

  onGenericFieldChange() {
    if (this.genericColumns) {
      const formValue = `generic.${this.genericFormControl.value}`;
      const value = this.genericColumns.find(column => column.toLowerCase() === formValue.toLowerCase());
      this.filter.field = value !== undefined ? value : null;
    }
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
      this.filter.value = Number(event.value) || null;
      break;
    case 'date':
      this.filter.value = event.value;
      break;
    case 'duration':
      this.filter.value = Number(event.value) || null;
    }
  }

  findInput(filter: Filter<T, U>): FilterInput {
    if (filter.for === 'generic') {
      return {
        type: 'string',
        value: filter.value as FilterInputValueString
      };
    }

    const type = this.findType(filter);
    const statuses = this.findStatuses(filter);

    switch (type) {
    case 'string':
      return {
        type: 'string',
        value: filter.value as FilterInputValueString
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
        value: filter.value as FilterInputValueString
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
        value: filter.value ? new Date(Number(filter.value) * 1000) : null
      };
    case 'duration':
      return {
        type: 'duration',
        value: filter.value as FilterInputValueDuration
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

  findOperator(filter: Filter<T, U>): Record<number, string> {
    const type = this.findType(filter);

    if (type === 'number' && filter.for === 'options') {
      return {
        [FilterNumberOperator.FILTER_NUMBER_OPERATOR_EQUAL]: $localize`Equal`,
        [FilterNumberOperator.FILTER_NUMBER_OPERATOR_NOT_EQUAL]: $localize`Not Equal`,
      };
    }

    const operators = this.#filtersService.findOperators(type);

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
