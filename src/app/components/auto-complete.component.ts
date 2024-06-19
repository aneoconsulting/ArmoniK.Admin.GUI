import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, WritableSignal, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  template: `
    <mat-form-field appearance="outline" subscriptSizing="dynamic">
      <mat-label i18n="Input label">Value</mat-label>
      <input matInput [matAutocomplete]="autocomplete" [formControl]="formControl" (input)="onInputChange()">
      <mat-autocomplete (optionSelected)="onInputChange()" #autocomplete>
        @for (option of filteredOptions(); track option) {
          <mat-option [value]="option">
            {{ option }}
          </mat-option>
        }
      </mat-autocomplete>
    </mat-form-field>
  `,
  imports: [
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoCompleteComponent implements OnInit {
  @Input({ required: true }) set options(entries: string[] | null) {
    this._options = entries ?? [];
    this.filteredOptions = signal(this._options);
  }

  @Input({ required: false }) set value(entry: string | null) {
    this._value = entry ?? '';
    if (this.formControl) {
      this.formControl.setValue(this._value);
    }
  }

  @Output() valueChange = new EventEmitter<string>();

  _options: string[];
  _value: string;
  filteredOptions: WritableSignal<string[]>;
  formControl: FormControl<string>;

  ngOnInit(): void {
    this.formControl = new FormControl<string>(this._value, { nonNullable: true });
  }

  onInputChange() {
    this.filteredOptions.update(() => this.filter());
    this.emit();
  }

  private filter() {
    return this._options.filter(option => option.toLowerCase().includes(this.formControl.value.toLowerCase()));
  }

  private emit() {
    this.valueChange.emit(this.formControl.value);
  }
}