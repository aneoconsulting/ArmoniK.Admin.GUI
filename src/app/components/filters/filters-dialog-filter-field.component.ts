import { FilterNumberOperator } from '@aneoconsultingfr/armonik.api.angular';
import { AsyncPipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, map, startWith } from 'rxjs';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { FilterDefinition } from '@app/types/filter-definition';
import { Filter, FilterInput, FilterInputOutput, FilterInputType, FilterInputValueString, FilterValueOptions, MaybeNull } from '@app/types/filters';
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
  <mat-autocomplete #autoProperty 
    (optionSelected)="onPropertyChange()"
    >
    <mat-option *ngFor="let property of filteredProperties | async" [value]="property">
      {{ property }}
    </mat-option>
  </mat-autocomplete>
</mat-form-field>

<mat-form-field appearance="outline" subscriptSizing="dynamic">
  <mat-label i18n="Label input">Operator</mat-label>
  <input matInput [matAutocomplete]="autoOperators" [formControl]="operatorFormControl" (input)="onOperatorChange()">
  <mat-autocomplete #autoOperators (optionSelected)="onOperatorChange()">
    <mat-option *ngFor="let operator of filteredOperators | async" [value]="operator">
      {{ operator }}
    </mat-option>
  </mat-autocomplete>
</mat-form-field>

<app-filters-dialog-input [input]="findInput(filter)" [statusFormControl]="statusFormControl" [filteredStatuses]="filteredStatuses" (valueChange)="onInputChange($event)"></app-filters-dialog-input>
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

  allProperties: FilterDefinition<T, U>[];
  propertyFormControl: FormControl<string | null>;
  filteredProperties: Observable<string[]>;

  allOperators: Record<number, string>;
  operatorFormControl: FormControl<string | null>;
  filteredOperators: Observable<string[]>;

  allStatuses: FilterValueOptions;
  statusFormControl: FormControl<string | null>;
  filteredStatuses: Observable<string[]>;

  #filtersService = inject(FiltersService);
  #dataFiltersService = inject(DATA_FILTERS_SERVICE);

  ngOnInit(): void {
    // Property form handling
    this.propertyFormControl = new FormControl(this.columnValue);
    this.allProperties = this.#dataFiltersService.retrieveFiltersDefinitions<T, U>();
    this.filteredProperties = this.propertyFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterProperties(value))
    );

    // Operator form handling
    this.allOperators = this.findOperator(this.filter);
    this.operatorFormControl = new FormControl(this.retrieveOperatorLabel(this.filter.operator));
    this.filteredOperators = this.operatorFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterOperators(value))
    );

    // Statuses form handling
    this.allStatuses = this.findStatuses(this.filter);
    this.statusFormControl = new FormControl(this.retrieveStatusLabel(this.filter.value as MaybeNull<number>));
    this.filteredStatuses = this.statusFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStatuses(value))
    );
  }

  private _filterProperties(value: MaybeNull<string>): string[] {
    const labelledProperties = this.allProperties.map(property => this.retrieveLabel(property));
    if (value === null) {
      return labelledProperties;
    } else {
      const filterValue = value.toLowerCase();
      return labelledProperties.filter(label => label.toLowerCase().includes(filterValue));
    }
  }

  private _filterOperators(value: MaybeNull<string>): string[] {
    const labelledOperators = Object.values(this.allOperators);
    if (value === null ) {
      return labelledOperators;
    } else {
      const filterValue = value.toLowerCase();
      return labelledOperators.filter(operator => operator.toLowerCase().includes(filterValue));
    }
  }

  private _filterStatuses(value: MaybeNull<string>): string[] {
    const labelledStatuses = Object.values(this.allStatuses).map(status => status.value);
    if (value === null) {
      return labelledStatuses;
    } else {
      const filterValue = value.toLowerCase();
      return labelledStatuses.filter(status => status.toLowerCase().includes(filterValue));
    }
  }

  get columnValue() {
    return this.filter.field && this.filter.for ? this.#dataFiltersService.retrieveLabel(this.filter.for, this.filter.field) : '';
  }

  retrieveLabel(filterDefinition: FilterDefinition<T, U>) {
    return this.#dataFiltersService.retrieveLabel(filterDefinition.for, filterDefinition.field);
  }

  retrieveOperatorLabel(operator: MaybeNull<number>): string {
    return operator !== null ? this.allOperators[operator] : '';
  }

  retrieveStatusLabel(status: MaybeNull<number>): string {
    return status ? this.allStatuses[status as number].value : '';
  }

  retrieveOperatorKey(operator: string) {
    const labelledOperators = Object.values(this.allOperators);
    const value = labelledOperators.find(label => label.toLowerCase().localeCompare(operator.toLowerCase()));
    return Object.keys(this.allOperators).filter(key => this.allOperators[Number(key)] === value);
  }

  retrieveStatusKey(status: MaybeNull<string>) {
    if (!status) {
      return null;
    }
    const key = this.allStatuses.find(label => label.value.toLowerCase().localeCompare(status))?.key;
    return key !== undefined ? key : null;
  }

  onPropertyChange() {
    const formValue = this.propertyFormControl.value;
    if (formValue) {
      const field = this.#dataFiltersService.retrieveField(formValue);

      if (field === -1) {
        return;
      }

      const for_ = this.allProperties.find(value => value.field === field)?.for;
      if (!for_) {
        return;
      }

      this.filter.for = for_;
      this.filter.field = field as T | U;

      this.allOperators = this.findOperator(this.filter);
      this.operatorFormControl.setValue('');

      this.allStatuses = this.findStatuses(this.filter);
      this.statusFormControl.setValue('');
      this.filter.value = null;
    }
  }

  onOperatorChange() {
    const formValue = this.operatorFormControl.value;
    if (formValue) {
      const key = this.retrieveOperatorKey(formValue);
      this.filter.operator = key !== undefined ? Number(key) : null;
    }
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
    case 'status':
      this.filter.value = this.retrieveStatusKey(event.value);
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
