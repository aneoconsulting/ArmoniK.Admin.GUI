import { Component, Input, OnInit, inject } from "@angular/core";
import { CustomColumn } from "@app/types/data";
import { FilterDefinition } from "@app/types/filter-definition";
import { FiltersEnums, FiltersOptionsEnums } from "@app/types/filters";
import { DataFilterService, FilterField } from "@app/types/services/data-filter.service";
import { AutoCompleteComponent } from "@components/auto-complete.component";
import { FormFilter } from "./types";

@Component({
  selector: 'app-filters-dialog-field',
  templateUrl: 'filters-dialog-field.component.html',
  standalone: true,
  imports: [
    AutoCompleteComponent,
  ],
})
export class FitlersDialogFieldComponent<F extends FiltersEnums, O extends FiltersOptionsEnums | null = null> implements OnInit {
  value: string | null = null;
  
  labelledProperties: string[];
  @Input({ required: true }) filter: FormFilter<F, O>;
  @Input({ required: true }) customProperties: CustomColumn[];
  
  private readonly dataFiltersService = inject(DataFilterService);

  ngOnInit(): void {
    this.labelledProperties = this.dataFiltersService.filtersDefinitions.map(property => this.retrieveLabel(property));
    if (this.customProperties) {
      this.labelledProperties.push(...this.customProperties.map(custom => custom.replace('options.options.', '')));
    }
  }

  private retrieveLabel(filterDefinition: FilterDefinition<F, O>) {
    return this.dataFiltersService.retrieveLabel(filterDefinition.for, filterDefinition.field as FilterField);
  }
  
  onChange(value: string): void {
    this.value = value;

    const field = this.dataFiltersService.retrieveField(value) as { for: string; index: number };
    if (field.index === -1) {
      const customField = this.customProperties.find(col => col.toLowerCase() === `options.options.${value.toLowerCase()}`);
      if (customField) {
        this.filter.controls.for.setValue('custom');
        this.filter.controls.field.setValue(value);
        this.filter.controls.operator.setValue(null);
        this.filter.markAsDirty();
      }
    } else {
      const for_ = this.dataFiltersService.filtersDefinitions.find(value => value.for === field.for && value.field === field.index)?.for;
      if (for_) {
        this.filter.controls.for.setValue(for_);
        this.filter.controls.field.setValue(field.index as F | O);
        this.filter.controls.operator.setValue(null);
        this.filter.markAsDirty();
      }
    }
  }
}