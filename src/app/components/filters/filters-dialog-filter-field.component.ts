import { Component, Input, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CustomColumn } from '@app/types/data';
import { FilterDefinition } from '@app/types/filter-definition';
import { Filter, FilterInput, FilterType, FilterValueOptions, FiltersEnums, FiltersOptionsEnums } from '@app/types/filters';
import { DataFilterService, FilterField } from '@app/types/services/data-filter.service';
import { AutoCompleteComponent } from '@components/auto-complete.component';
import { FiltersService } from '@services/filters.service';
import { FiltersDialogInputComponent } from './filters-dialog-input.component';

@Component({
  selector: 'app-filters-dialog-filter-field',
  templateUrl: './filters-dialog-filter-field.component.html',
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
    MatFormFieldModule,
    MatSelectModule,
    FiltersDialogInputComponent,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteComponent,
  ],
  providers: [
    FiltersService,
  ],
})
export class FiltersDialogFilterFieldComponent<F extends FiltersEnums, O extends FiltersOptionsEnums | null = null> {
  @Input({ required: true }) first: boolean;
  @Input({ required: true }) set filter(entry: Filter<F, O>) {
    this._filter = entry;
    this.setStatuses();
    this.setType();
    this.setInput();
    this.setProperties();
    this.setOperators();
    this.setColumnValue();
  }
  @Input({ required: false }) set customColumns(entries: CustomColumn[]) {
    this._customColumns = entries;
    this.addCustomsToProperties();
  }

  labelledProperties: string[];

  allOperators: Record<number, string>;
  labelledOperators: string[];

  allStatuses: FilterValueOptions;
  labelledStatuses: string[];

  readonly filtersService = inject(FiltersService);
  readonly dataFiltersService = inject(DataFilterService);

  _filter: Filter<F, O>;
  _customColumns: CustomColumn[];
  columnValue: string;
  operatorLabel: string;
  input: FilterInput;
  type: FilterType;

  get filter() {
    return this._filter;
  }

  private setColumnValue() {
    if (this._filter.field && this._filter.for) {
      if (this._filter.for !== 'custom') {
        this.columnValue = this.dataFiltersService.retrieveLabel(this._filter.for, this._filter.field as FilterField);
      } else {
        this.columnValue = this._filter.field.toString();
      }
    } else {
      this.columnValue = '';
    }
  }

  private setType() {
    this.type = this.findType();
  }

  private setProperties() {
    this.labelledProperties = this.dataFiltersService.filtersDefinitions.map(property => this.retrieveLabel(property));
    this.addCustomsToProperties();
  }

  private addCustomsToProperties() {
    if (this._customColumns) {
      this.labelledProperties.push(...this._customColumns.map(custom => custom.replace('options.options.', '')));
    }
  }

  private retrieveLabel(filterDefinition: FilterDefinition<F, O>) {
    return this.dataFiltersService.retrieveLabel(filterDefinition.for, filterDefinition.field as FilterField);
  }

  private setOperators() {
    this.allOperators = this.findOperators();
    this.labelledOperators = Object.values(this.allOperators);
    this.setOperatorLabel();
  }

  private setOperatorLabel() {
    this.operatorLabel = this._filter.operator !== null ? this.allOperators[this._filter.operator] : '';
  }

  private setStatuses() {
    this.allStatuses = this.findStatuses();
    this.labelledStatuses = Object.values(this.allStatuses).map(status => status.value);
  }

  private retrieveStatusKey(status: string) {
    const key = this.allStatuses.find(label => label.value.toLowerCase() === status.toLowerCase())?.key;
    if (key) {
      return key;
    }
    return null;
  }

  onPropertyChange(value: string) {
    const field = this.dataFiltersService.retrieveField(value) as { for: string; index: number };
    if (field.index === -1) {
      const customField = this._customColumns?.find(col => col.toLowerCase() === `options.options.${value.toLowerCase()}`);
      if (customField) {
        this._filter.for = 'custom';
        this._filter.field = value;
        this.filter.operator = null;
      }
    } else {
      const for_ = this.dataFiltersService.filtersDefinitions.find(value => value.for === field.for && value.field === field.index)?.for;
      if (for_) {
        this._filter.for = for_;
        this._filter.field = field.index as F | O;
        this.filter.operator = null;
      }
    }
    this.setType();
    this.setStatuses();
    this.setOperators();
    this._filter.value = null;
    this.setInput();
  }

  onOperatorChange(value: string) {
    const key = this.retrieveOperatorKey(value);
    this._filter.operator = key !== undefined ? Number(key) : null;
  }

  private retrieveOperatorKey(operator: string) {
    const labelledOperators = Object.values(this.allOperators);
    const value = labelledOperators.find(label => label.toLowerCase() === operator.toLowerCase());
    return Object.keys(this.allOperators).find(key => this.allOperators[Number(key)] === value);
  }

  onInputChange(value: string) {
    if (this.type === 'number' || this.type === 'duration') {
      const number = Number(value);
      this._filter.value = !isNaN(number) ? number : null;
    } else if (this.type === 'status') {
      this._filter.value = this.retrieveStatusKey(value);
    } else {
      this._filter.value = value;
    }
  }

  private setInput() {
    switch (this.type) {
    case 'string': {
      this.input = {
        type: 'string',
        value: this._filter.value as string
      };
      break;
    }
    case 'number': {
      this.input = {
        type: 'number',
        value: Number(this._filter.value) || null
      };
      break;
    }
    case 'array': {
      this.input = {
        type: 'array',
        value: this._filter.value as string
      };
      break;
    }
    case 'status': {
      this.input = {
        type: 'status',
        value: this.allStatuses[this._filter.value as number]?.value ?? null,
      };
      break;
    }
    case 'date': {
      this.input = {
        type: 'date',
        value: this._filter.value ? new Date(Number(this._filter.value) * 1000) : null
      };
      break;
    }
    case 'duration': {
      this.input = {
        type: 'duration',
        value: this._filter.value as number
      };
      break;
    }
    case 'boolean': {
      this.input = {
        type: 'boolean',
        value: this._filter.value as boolean
      };
      break;
    }
    default:
      throw new Error(`Unknown type ${this.type}`);
    }
  }

  private findType(): FilterType {
    if (this._filter.field && this._filter.for !== 'custom') {
      const field = this.findFilterMetadata(this._filter);
      if (field) {
        return field.type;
      }
    }
    return 'string';
  }

  private findStatuses(): FilterValueOptions {
    if (this._filter.field) {
      const field = this.findFilterMetadata(this._filter);
      if (field?.type === 'status') {
        return field.statuses;
      }
    }
    return [];
  }

  private findOperators(): Record<number, string> {
    return this.filtersService.findOperators(this.type);
  }

  private findFilterMetadata(filter: Filter<F, O>): FilterDefinition<F, O> | null {
    return this.dataFiltersService.filtersDefinitions.find(f => f.for === filter.for && f.field === filter.field) ?? null;
  }
}
