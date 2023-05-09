import { NgFor } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatChipsModule } from "@angular/material/chips";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Filter } from "../types";

@Component({
  selector: 'app-filters-chips',
  template: `
  <mat-chip-listbox>
    <ng-container *ngFor="let filter of filters; let index = index; trackBy:trackByFilter">
      <mat-chip [matTooltip]="filter.value ? filter.field + '=' + filter.value: 'No value'">
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
export class FiltersChipsComponent {
  @Input() filters: Filter[] = [];

  trackByFilter(_: number, filter: Filter): string {
    return filter.field ?? '';
  }
}
