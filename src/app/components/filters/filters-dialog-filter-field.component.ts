import { FilterNumberOperator } from '@aneoconsultingfr/armonik.api.angular';
import { AsyncPipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, Subject, map, merge, startWith } from 'rxjs';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { FilterDefinition, FilterFor } from '@app/types/filter-definition';
import { Filter, FilterInput, FilterInputOutput, FilterInputType, FilterInputValueString, FilterValueOptions } from '@app/types/filters';
import { FiltersService } from '@services/filters.service';
import { FiltersDialogInputComponent } from './filters-dialog-input.component';

@Component({
  selector: 'app-filters-dialog-filter-field',
  template: `
<span *ngIf="first" i18n="Filter condition">Where</span>
<span *ngIf="!first" i18n="Filter condition">And</span>
<mat-form-field appearance="outline"  subscriptSizing="dynamic">
  <mat-label i18n="Label input">Property</mat-label>
  <input matInput [matAutocomplete]="autoProperty" [formControl]="propertyFormControl" (input)="onPropertyChange()">
  <mat-autocomplete #autoProperty (optionSelected)="onPropertyChange()">
    <mat-option *ngFor="let property of filteredProperties | async" [value]="property">
      {{ property }}
    </mat-option>
  </mat-autocomplete>
</mat-form-field>

<mat-form-field appearance="outline"  subscriptSizing="dynamic">
  <mat-label i18n="Label input">Operator</mat-label>
  <input matInput [matAutocomplete]="autoOperators" [formControl]="operatorFormControl" (input)="onOperatorChange()">
  <mat-autocomplete #autoOperators (optionSelected)="onOperatorChange()">
    <mat-option *ngFor="let operator of filteredOperators | async" [value]="operator">
      {{ operator }}
    </mat-option>
  </mat-autocomplete>
</mat-form-field>

<app-filters-dialog-input [input]="findInput(filter)" [inputStatus]="filterPropertyChange$" (valueChange)="onInputChange($event)"></app-filters-dialog-input>
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
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    FiltersService,
  ],
})
export class FiltersDialogFilterFieldComponent<T extends number, U extends number | null = null> implements OnInit {
  @Input({ required: true }) first: boolean;
  @Input({ required: true }) filter: Filter<T, U>;

  properties: string[];
  propertyFormControl = new FormControl('');
  filteredProperties: Observable<string[]>;

  labelledOperators: string[];
  operators: Record<number, string>;
  operatorFormControl = new FormControl('');
  filteredOperators: Observable<string[]>;
  filterPropertyChange$ = new Subject<void>();

  #filtersService = inject(FiltersService);
  #dataFiltersService = inject(DATA_FILTERS_SERVICE);

  ngOnInit(): void {
    this.propertyFormControl.setValue(this.columnValue);
    this.properties = this.#dataFiltersService.retrieveFiltersDefinitions<T, U>().map(value => this.retrieveLabel(value));
    
    this.operators = this.findOperator(this.filter);
    this.labelledOperators = Object.values(this.operators);

    this.operatorFormControl.setValue(this.filter.operator !== null ? this.operators[this.filter.operator] : '');

    this.filteredProperties = this.propertyFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._fieldFilter(value || '', this.properties)),
    );

    this.filteredOperators = merge(this.operatorFormControl.valueChanges, this.filterPropertyChange$).pipe(
      startWith(''),
      map(value => this._fieldFilter(value || '', this.labelledOperators))
    );
  }

  private _fieldFilter(value: string, fields: string[]): string[] {
    const filterValue = value.toLowerCase();

    return fields.filter(field => field.toLowerCase().includes(filterValue));
  }

  get filtersDefinitions() {
    return this.#dataFiltersService.retrieveFiltersDefinitions<T, U>();
  }

  get columnValue() {
    return this.filter.field && this.filter.for ? this.#dataFiltersService.retrieveLabel(this.filter.for, this.filter.field) : '';
  }

  retrieveLabel(filterDefinition: FilterDefinition<T, U>) {
    return this.#dataFiltersService.retrieveLabel(filterDefinition.for, filterDefinition.field);
  }

  onPropertyChange() {
    const field = this.#dataFiltersService.retrieveField(this.propertyFormControl.value as unknown as string);
    if (field === -1) {
      return;
    }

    const for_ = this.filtersDefinitions.find((value) => value.field === field)?.for;
    if (!for_) {
      return;
    }

    this.filter.for = for_ as FilterFor<T, U>;
    this.filter.field = field as T | U;

    this.operators = this.findOperator(this.filter);
    this.labelledOperators = Object.values(this.operators);
    this.operatorFormControl.setValue('');
    this.filterPropertyChange$.next();
    this.filter.value = null;
  }

  onOperatorChange() {
    const newOperator = this.operatorFormControl.value?.toLowerCase();
    if (!newOperator) {
      return;
    }

    const value = this.labelledOperators.find(label => label.toLowerCase() === newOperator);
    const key = Object.keys(this.operators).map(key => Number(key)).find((key: number) => this.operators[key] === value);

    this.filter.operator = key !== undefined ? key : null;
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
    }
  }

  findInput(filter: Filter<T, U>): FilterInput {
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

  #findFilterMetadata(filter: Filter<T, U>): FilterDefinition<T, U> | null {
    return this.#dataFiltersService.retrieveFiltersDefinitions<T, U>().find(f => f.for === filter.for && f.field === filter.field) ?? null;
  }
}
