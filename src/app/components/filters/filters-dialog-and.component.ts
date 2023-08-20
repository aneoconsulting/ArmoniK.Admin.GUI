import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Filter } from '@app/types/filters';
import { IconsService } from '@services/icons.service';
import { FiltersDialogFilterFieldComponent } from './filters-dialog-filter-field.component';

@Component({
  selector: 'app-filters-dialog-and',
  template: `
<app-filters-dialog-filter-field
  [first]="first"
  [filter]="filter"
  >
</app-filters-dialog-filter-field>

<button mat-icon-button aria-label="More options" mat-tooltip="More options" [matMenuTriggerFor]="menu">
  <mat-icon aria-hidden="true" [fontIcon]="getIcon('more')"></mat-icon>
</button>

<mat-menu #menu="matMenu">
  <button mat-menu-item (click)="onClear()">
    <mat-icon aria-hidden="true" [fontIcon]="getIcon('clear')"></mat-icon>
    <span i18n>Clear</span>
  </button>
  <button mat-menu-item (click)="onRemove()">
    <mat-icon aria-hidden="true" [fontIcon]="getIcon('delete')"></mat-icon>
    <span i18n>Remove</span>
  </button>
</mat-menu>
  `,
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
