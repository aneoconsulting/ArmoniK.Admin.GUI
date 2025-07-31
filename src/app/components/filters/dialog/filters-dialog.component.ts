import { Component, Inject, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomColumn } from '@app/types/data';
import { FiltersDialogData } from '@app/types/dialog';
import { FilterFor } from '@app/types/filter-definition';
import { FiltersEnums, FiltersOptionsEnums, FiltersOr } from '@app/types/filters';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { FiltersDialogAndComponent } from './filters-dialog-and.component';
import { FilterInputValue, FormFilter, FormFilterType, FormFiltersAnd, FormFiltersOr } from './types';

@Component({
  selector: 'app-filters-dialog',
  templateUrl: './filters-dialog.component.html',
  styleUrl: './filters-dialog.component.css',
  standalone: true,
  imports: [
    FiltersDialogAndComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  providers: [
    FiltersService,
  ],
})
export class FiltersDialogComponent<F extends FiltersEnums, O extends FiltersOptionsEnums | null = null> {
  private readonly iconsService = inject(IconsService);

  readonly form: FormFiltersOr<F, O> = new FormArray<FormFiltersAnd<F, O>>([]);
  customProperties: CustomColumn[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: FiltersDialogData<F, O>) {
    this.init();
  }

  private init() {
    if (!this.data.filtersOr.length) {
      this.add();
    } else {
      this.patchFormValues(this.data.filtersOr);
    }
    this.customProperties = this.data.customColumns ?? [];
  }

  add(index?: number) {
    const filter: FormFilter<F, O> = new FormGroup<FormFilterType<F, O>>({
      for: new FormControl<FilterFor<F, O> | null>(null),
      field: new FormControl<F | O | string | null>(null),
      operator: new FormControl<number | null>(null),
      value: new FormControl<FilterInputValue>(null),
    });

    if (index !== undefined) {
      this.form.insert(index + 1, new FormArray([filter]));
    } else {
      this.form.push(new FormArray([filter]));
    }
  }

  remove(index: number) {
    this.form.removeAt(index);

    if (this.form.length === 0) {
      this.add();
    }
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  private patchFormValues(filterOr: FiltersOr<F, O>) {
    this.form.reset();
    filterOr.forEach((filterAnd) => {
      const array = new FormArray(
        filterAnd.map((filter) => new FormGroup<FormFilterType<F, O>>({
          for: new FormControl<FilterFor<F, O> | null>(filter.for),
          field: new FormControl<F | O | string | null>(filter.field),
          operator: new FormControl<number | null>(filter.operator),
          value: new FormControl<FilterInputValue>(filter.value)})
        )
      );
      this.form.push(array);
    });
  }
}
