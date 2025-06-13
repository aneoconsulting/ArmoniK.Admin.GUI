import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AutoCompleteComponent } from '@components/auto-complete.component';

@Component({
  selector: 'app-filters-dialog-operator',
  templateUrl: 'filters-dialog-operator.component.html',
  standalone: true,
  imports: [
    AutoCompleteComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FiltersDialogOperatorComponent),
      multi: true,
    },
  ],
})
export class FiltersDialogOperatorComponent implements ControlValueAccessor {
  value: string | null = null;

  @Input({ required: true }) set operators(entry: Record<number, string>) {
    this.operatorRecord = entry;
    this.operatorsLabels = Object.values(entry);
  }

  private operatorRecord: Record<number, string>;
  operatorsLabels: string[];

  writeValue(value: string | null): void {
    if (value !== null && !isNaN(Number(value))) {
      value = this.operatorRecord[Number(value)] ?? '';
    }
    this.value = value;

    const key = value ? this.retrieveOperatorKey(value) : null;

    if (this.registeredOnChange) {
      this.registeredOnChange(key);
    }

    if (this.registeredOnTouched) {
      this.registeredOnTouched(key);
    }
  }

  private retrieveOperatorKey(operator: string) {
    const labelledOperators = Object.values(this.operatorRecord);
    const value = labelledOperators.find(label => label.toLowerCase() === operator.toLowerCase());
    const key = Object.keys(this.operatorRecord).find(key => this.operatorRecord[Number(key)] === value);
    return key ? Number(key) : null;
  }

  private registeredOnChange?: (val: number | null) => void;

  private registeredOnTouched?: (val: number | null) => void;

  registerOnChange(fn: (val: number | null) => void): void {
    this.registeredOnChange = fn;
  }

  registerOnTouched(fn: (val: number | null) => void): void {
    this.registeredOnTouched = fn;
  }
}