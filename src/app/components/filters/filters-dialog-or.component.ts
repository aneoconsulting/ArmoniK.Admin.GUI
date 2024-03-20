import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CustomColumn } from '@app/types/data';
import { Filter } from '@app/types/filters';
import { IconsService } from '@services/icons.service';
import { FiltersDialogAndComponent } from './filters-dialog-and.component';

@Component({
  selector: 'app-filters-dialog-or',
  templateUrl: './filters-dialog-or.component.html',
  styles: [`
:host {
  display: flex;
  flex-direction: row;
  gap: 2rem;
}

span {
  padding-top: 1rem;
  min-width: 3rem;
  text-align: end;
}

.filters {
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  padding: 1rem;
}

.filters-and {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
  `],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FiltersDialogAndComponent,
    MatButtonModule,
    MatMenuModule,
    MatIconModule
  ],
  providers: [
    IconsService
  ],
})
export class FiltersDialogOrComponent<T extends number, U extends number | null = null> {
  @Input({ required: true }) first: boolean;
  @Input({ required: true }) filtersOr: Filter<T, U>[];
  @Input() customColumns: CustomColumn[] | undefined;

  @Output() removeChange: EventEmitter<Filter<T, U>[]> = new EventEmitter<Filter<T, U>[]>();

  #iconsService = inject(IconsService);

  getIcon(name: string) {
    return this.#iconsService.getIcon(name);
  }

  onAdd() {
    this.filtersOr.push({
      for: null,
      field: null,
      operator: null,
      value: null,
    });
  }

  onRemoveAnd(filter: Filter<T, U>) {
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
