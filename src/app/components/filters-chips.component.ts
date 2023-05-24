import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Filter } from '@app/types/filters';

@Component({
  selector: 'app-filters-chips',
  template: `
  <mat-chip-listbox>
    <ng-container *ngFor="let filter of filters; let index = index; trackBy:trackByFilter">
      <mat-chip [matTooltip]="toolTip(filter)">
        <!-- TODO: localize -->
        <span> {{ filter.field ?? 'No value' }} </span>
      </mat-chip>
    </ng-container>
  </mat-chip-listbox>
  `,
  styles: [`
  `],
  standalone: true,
  imports: [
    NgFor,
    MatChipsModule,
    MatTooltipModule
  ]
})
export class FiltersChipsComponent<T extends object> {
  @Input() filters: Filter<T>[] = [];

  toolTip(filter: Filter<T>): string {
    if (!filter.value)
    // TODO: localize
      return 'No value';

    if (filter.value instanceof Object)
    // TODO: localize with param
      return (filter.field as string) + '=' + 'from ' + filter.value.start + ' to ' + filter.value.end;

    // TODO: localize with param
    return (filter.field as string) + '=' + filter.value;
  }

  trackByFilter(_: number, filter: Filter<T>): string {
    return (filter.field as string) ?? '';
  }
}
