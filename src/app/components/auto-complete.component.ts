import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  templateUrl: 'auto-complete.component.html',
  imports: [
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoCompleteComponent implements OnInit {
  @Input({ required: true }) set options(entries: string[]) {
    this._options = entries;
    this.filteredOptions.set(this._options);
    this.hasOneOption = this._options.length === 1;
    if (this.formControl) {
      this.formControlStatus();
    }
  }

  @Input({ required: false }) set value(entry: string | number | null | undefined) {
    this._value = entry?.toString() ?? '';
    if (this.formControl) {
      this.formControl.setValue(this._value);
    }
  }

  @Input({ required: false }) label: string | null;
  defaultLabel = $localize`Value`;

  @Output() valueChange = new EventEmitter<string>();

  private _options: string[];
  private _value: string;
  hasOneOption: boolean = false;
  filteredOptions = signal<string[]>([]);
  formControl: FormControl<string>;

  ngOnInit(): void {
    this.checkOptions();
    this.formControl = new FormControl<string>({value: this._value, disabled: this.hasOneOption}, { nonNullable: true });
  }

  checkOptions() {
    if (this.hasOneOption) {
      this.value = this._options[0];
    }
  }

  formControlStatus() {
    if (this.hasOneOption) {
      this.formControl.disable();
      this.formControl.setValue(this._options[0]);
    } else {
      this.formControl.enable();
    }
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