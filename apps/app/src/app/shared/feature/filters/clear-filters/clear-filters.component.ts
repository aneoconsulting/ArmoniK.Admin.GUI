import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-clear-filters',
  templateUrl: './clear-filters.component.html',
  styleUrls: ['./clear-filters.component.scss'],
  imports: [CommonModule],
})
export class ClearFiltersComponent {
  @Input() isFiltered = false;
  @Output() clearFilter = new EventEmitter<never>();

  public clearFilters(): void {
    this.clearFilter.emit();
  }
}
