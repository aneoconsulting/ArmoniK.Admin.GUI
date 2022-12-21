import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-clear-filters',
  templateUrl: './clear-filters.component.html',
  styleUrls: ['./clear-filters.component.scss'],
  imports: [TranslateModule],
})
export class ClearFiltersComponent {
  @Output() clearFilter = new EventEmitter<never>();

  public clearFilters(): void {
    this.clearFilter.emit();
  }
}
