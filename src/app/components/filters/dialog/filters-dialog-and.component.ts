import { Component, Input, OnDestroy, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomColumn } from '@app/types/data';
import { FilterDefinition, FilterFor } from '@app/types/filter-definition';
import { Filter, FilterType, FiltersEnums, FiltersOptionsEnums } from '@app/types/filters';
import { DataFilterService } from '@app/types/services/data-filter.service';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { Subscription } from 'rxjs';
import { FitlersDialogFieldComponent } from './filters-dialog-field.component';
import { FiltersDialogInputComponent } from './filters-dialog-input.component';
import { FiltersDialogOperatorComponent } from './filters-dialog-operator.component';
import { FilterInputValue, FormFilter, FormFilterType, FormFiltersAnd } from './types';

@Component({
  selector: 'app-filters-dialog-and',
  templateUrl: './filters-dialog-and.component.html',
  styleUrl: './filters-dialog-and.component.css',
  standalone: true,
  imports: [
    FiltersDialogInputComponent,
    FiltersDialogOperatorComponent,
    ReactiveFormsModule,
    FitlersDialogFieldComponent,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
  ],
  providers: [
    FiltersService,
  ]
})
export class FiltersDialogAndComponent<F extends FiltersEnums, O extends FiltersOptionsEnums | null = null> implements OnDestroy {
  @Input({ required: true }) set form(entry: FormFiltersAnd<F, O>) {
    this.filterAnd = entry;

    entry.controls.forEach((filter) => {
      const subscription = filter.controls.field.valueChanges.subscribe(() => {
        filter.controls.operator.setValue(null);
        filter.controls.value.setValue(null);
      });

      this.subscriptions.add(subscription);
    });
  }

  @Input({ required: true }) customProperties: CustomColumn[];

  filterAnd: FormFiltersAnd<F, O>;
  private readonly iconsService = inject(IconsService);
  private readonly dataFiltersService = inject(DataFilterService);
  readonly filtersService = inject(FiltersService);

  private readonly subscriptions = new Subscription();

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }

  add() {
    const filter: FormFilter<F, O> = new FormGroup<FormFilterType<F, O>>({
      for: new FormControl<FilterFor<F, O> | null>(null),
      field: new FormControl<F | O | string | null>(null),
      operator: new FormControl<number | null>(null),
      value: new FormControl<FilterInputValue>(null),
    });

    this.form.push(filter);
  }

  remove(index: number) {
    this.form.removeAt(index);
    if (this.form.length === 0) {
      this.add();
    }
  }

  private findFilterMetadata(filter: Filter<F, O>): FilterDefinition<F, O> | null {
    return this.dataFiltersService.filtersDefinitions.find(f => f.for === filter.for && f.field === filter.field) ?? null;
  }

  findOperators(type: FilterType): Record<number, string> {
    return this.filtersService.findOperators(type);
  }

  findType(filter: Partial<Filter<F, O>>): FilterType {
    if (filter.field && filter.for !== 'custom') {
      const field = this.findFilterMetadata(filter as Filter<F, O>);
      if (field) {
        return field.type;
      }
    }
    return 'string';
  }

  findStatuses(filter: Partial<Filter<F, O>>): string[] {
    if (filter.field) {
      const field = this.findFilterMetadata(filter as Filter<F, O>);
      if (field?.type === 'status') {
        return field.statuses.map((status) => status.value);
      }
    }
    return [];
  }

  updateFor(filter: FormFilter<F, O>, $event: FilterFor<F, O>) {
    filter.controls.for.setValue($event);
  }
}