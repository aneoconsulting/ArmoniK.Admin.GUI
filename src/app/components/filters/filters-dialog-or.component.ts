import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CustomColumn } from '@app/types/data';
import { Filter, FiltersEnums, FiltersOptionsEnums } from '@app/types/filters';
import { IconsService } from '@services/icons.service';
import { FiltersDialogAndComponent } from './filters-dialog-and.component';

@Component({
  selector: 'app-filters-dialog-or',
  templateUrl: './filters-dialog-or.component.html',
  styleUrl: 'filters-dialog-or.component.css',
  imports: [
    FiltersDialogAndComponent,
    MatButtonModule,
    MatMenuModule,
    MatIconModule
  ],
  providers: [
    IconsService
  ]
})
export class FiltersDialogOrComponent<F extends FiltersEnums, O extends FiltersOptionsEnums | null = null> {
  @Input({ required: true }) first: boolean;
  @Input({ required: true }) filtersOr: Filter<F, O>[];
  @Input() customColumns: CustomColumn[];

  @Output() removeChange: EventEmitter<Filter<F, O>[]> = new EventEmitter<Filter<F, O>[]>();

  private readonly iconsService = inject(IconsService);

  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }

  onAdd() {
    this.filtersOr.push({
      for: null,
      field: null,
      operator: null,
      value: null,
    });
  }

  onRemoveAnd(filter: Filter<F, O>) {
    const index = this.filtersOr.indexOf(filter);
    if (index > -1) {
      this.filtersOr.splice(index, 1);
    }
    if (this.filtersOr.length === 0) {
      this.onAdd();
    }
  }

  onRemoveOr() {
    this.removeChange.emit(this.filtersOr);
  }
}
