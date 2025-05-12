import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomColumn } from '@app/types/data';
import { FiltersDialogData } from '@app/types/dialog';
import { FiltersEnums, FiltersOptionsEnums } from '@app/types/filters';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { FilterInputValue, FormFilter, FormFilterType, FormFiltersAnd, FormFiltersOr } from './types';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FilterFor } from '@app/types/filter-definition';
import { FiltersDialogAndComponent } from './filters-dialog-and.component';

@Component({
  selector: 'app-filters-dialog',
  templateUrl: './filters-dialog.component.html',
  styles: [`
.filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
  `],
  standalone: true,
  imports: [
    FiltersDialogAndComponent,
  ],
  providers: [
    FiltersService,
  ],
})
export class FiltersDialogComponent<F extends FiltersEnums, O extends FiltersOptionsEnums | null = null> {
  private readonly iconsService = inject(IconsService);
  private readonly dialogRef = inject(MatDialogRef<FiltersDialogComponent<F, O>>);

  readonly form: FormFiltersOr<F, O> = new FormArray<FormFiltersAnd<F, O>>([]);
  customProperties: CustomColumn[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: FiltersDialogData<F, O>) {
    if (!this.data.filtersOr.length) {
      this.add();
    } else {
      this.form.patchValue(this.data.filtersOr);
    }
    this.customProperties = this.data.customColumns ?? [];
  }

  add() {
    const filter: FormFilter<F, O> = new FormGroup<FormFilterType<F, O>>({
      for: new FormControl<FilterFor<F, O> | null>(null),
      field: new FormControl<F | O | string | null>(null),
      operator: new FormControl<number | null>(null),
      value: new FormControl<FilterInputValue>(null),
    });

    this.form.push(new FormArray([filter]));
  }

  remove(index: number) {
    this.form.removeAt(index);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }
}
