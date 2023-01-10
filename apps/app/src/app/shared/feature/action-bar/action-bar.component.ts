import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoRefreshDropdownComponent } from '@armonik.admin.gui/shared/feature';
import { ClearFiltersComponent } from '../filters';
import { ClearOrderComponent } from '../clear-order/clear-order.component';

@Component({
  selector: 'app-action-bar',
  standalone: true,
  imports: [
    CommonModule,
    AutoRefreshDropdownComponent,
    ClearFiltersComponent,
    ClearOrderComponent,
  ],
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss'],
})
export class ActionBarComponent {
  @Input() refreshInterval = 10000;
  @Input() isOrdered = false;
  @Input() isFiltered = false;

  @Output() refresh = new EventEmitter<never>();
  @Output() updateInterval = new EventEmitter<number>();
  @Output() clearSort = new EventEmitter<never>();
  @Output() clearFilters = new EventEmitter<never>();

  manualRefresh() {
    this.refresh.emit();
  }

  onUpdateInterval(value: number) {
    this.updateInterval.emit(value);
  }

  clearOrder() {
    this.clearSort.emit();
  }

  clearAllFilters() {
    this.clearFilters.emit();
  }
}
