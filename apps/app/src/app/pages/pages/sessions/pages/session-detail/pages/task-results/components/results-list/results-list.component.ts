import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormattedResult, Pagination } from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridStateInterface } from '@clr/angular';
import { StatesService } from '../../../../../../../../../shared';

@Component({
  selector: 'app-pages-results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.scss'],
})
export class ResultsListComponent {
  @Input() stateKey = '';
  @Input() data: Pagination<FormattedResult> | null = null;
  @Input() loading = true;

  @Output() refresh = new EventEmitter<ClrDatagridStateInterface>();

  constructor(private statesService: StatesService) {}

  /**
   * Get current page
   *
   * @returns current page
   */
  get currentPage(): number {
    return this.statesService.getCurrentPage(this.stateKey);
  }

  /**
   * Get page size
   *
   * @returns page size
   */
  get pageSize(): number {
    return this.statesService.getPageSize(this.stateKey);
  }

  /**
   * Get total
   *
   * @returns total
   */
  get total(): number {
    return this.data?.meta.total || 0;
  }

  /**
   * Track by item
   *
   * @param index
   * @param item
   */
  trackByItem(_: number, item: FormattedResult): string {
    return item._id;
  }
}
