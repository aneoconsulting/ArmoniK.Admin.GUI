import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

/**
 * Options shown at most: each one is a component, built even while the panel is closed, and the
 * graph gives the ids of all its nodes, tens of thousands of them.
 */
const MAX_OPTIONS = 100;

@Component({
  selector: 'app-autocomplete',
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
    // Options that change while the user types keep what was typed filtering them.
    this.filteredOptions.set(this.filter());
    this.hasOneOption = this._options.length === 1;
    if (this.formControl) {
      this.formControlStatus();
    }
  }

  @Input({ required: false }) set value(entry: string | number | null | undefined) {
    this._value = entry?.toString() ?? '';
    this.typed = false;
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
  /** Whether the input holds what the user typed, rather than a value given to the component. */
  private typed = false;
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
    this.typed = true;
    this.filteredOptions.update(() => this.filter());
    this.emit();
  }

  private filter(): string[] {
    const typed = this.typed ? this.formControl.value.toLowerCase() : '';
    const matches: string[] = [];
    for (const option of this._options) {
      if (matches.length === MAX_OPTIONS) {
        break;
      }
      if (option.toLowerCase().includes(typed)) {
        matches.push(option);
      }
    }
    return matches;
  }

  private emit() {
    this.valueChange.emit(this.formControl.value);
  }
}