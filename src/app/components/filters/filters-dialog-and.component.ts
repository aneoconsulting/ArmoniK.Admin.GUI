import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CustomColumn } from '@app/types/data';
import { Filter } from '@app/types/filters';
import { IconsService } from '@services/icons.service';
import { FiltersDialogFilterFieldComponent } from './filters-dialog-filter-field.component';

@Component({
  selector: 'app-filters-dialog-and',
  templateUrl: './filters-dialog-and.component.html',
  styles: [`
:host {
  display: flex;
  flex-direction: row;
  align-items: center;

  gap: 1rem;
}
  `],
  standalone: true,
  imports: [
    FiltersDialogFilterFieldComponent,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [
    IconsService,
  ],
})
export class FiltersDialogAndComponent<T extends number, U extends number | null = null> {
  @Input({ required: true }) first: boolean;
  @Input({ required: true }) filter: Filter<T, U>;
  @Input() customColumns: CustomColumn[] | undefined;

  @Output() removeChange: EventEmitter<Filter<T, U>> = new EventEmitter<Filter<T, U>>();

  #iconsService = inject(IconsService);

  getIcon(name: string) {
    return this.#iconsService.getIcon(name);
  }

  onClear() {
    this.filter.value = null;
  }

  onRemove() {
    this.removeChange.emit(this.filter);
  }
}
