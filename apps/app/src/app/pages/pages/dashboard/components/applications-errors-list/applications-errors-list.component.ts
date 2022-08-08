import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ApplicationError,
  Pagination,
} from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridSortOrder, ClrDatagridStateInterface } from '@clr/angular';
import { StatesService } from '../../../../../shared';

/**
 * Display applications errors in list
 */
@Component({
  selector: 'app-pages-dashboard-applications-errors-list',
  templateUrl: './applications-errors-list.component.html',
  styleUrls: ['./applications-errors-list.component.scss'],
})
export class ApplicationsErrorsListComponent {
  @Input() stateKey = '';
  @Input() applications: Pagination<ApplicationError> | null = null;
  @Input() loading = true;

  @Output() refresh = new EventEmitter<ClrDatagridStateInterface>();

  @Input() isSeqUp = false;
  @Output() clickSeqLink = new EventEmitter<string>();

  constructor(private statesService: StatesService) {}

  /**
   * Get currant page
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
   * Get filter value from the filters store
   *
   * @param key Key to find the filter value
   *
   * @returns filter value
   */
  getFilterValue(key: string): string {
    return this.statesService.getFilterValue(this.stateKey, key);
  }

  /**
   * Get sort order from the filters store
   *
   * @param key Key to find the sort order
   *
   * @returns sort order
   */
  getSortOrder(key: string): ClrDatagridSortOrder {
    return this.statesService.getSortOrder(this.stateKey, key);
  }

  /**
   * Delete state from the filters store
   *
   */
  deleteState() {
    this.statesService.deleteState(this.stateKey);
    this.refresh.emit({});
  }

  /**
   * Except text using ellipsis when longer than 100 characters
   *
   * @param text
   */
  excerpt(text: string): string {
    if (text?.length > 100) {
      return text.substring(0, 100) + '...';
    }

    return text;
  }

  /**
   * Emit event when click on seq link
   *
   * @param taskId Task id
   */
  onClickSeqLink(event: Event, taskId: string) {
    event.preventDefault();
    this.clickSeqLink.emit(taskId);
  }

  /**
   * Return total number of applications event if there is no task (return 0)
   */
  get totalApplications(): number {
    return this.applications ? this.applications.meta.total : 0;
  }

  /**
   * Track error by id
   *
   * @param _
   * @param error
   *
   * @returns task id
   */
  trackErrors(_: number, error: ApplicationError): string {
    return error.taskId;
  }
}
