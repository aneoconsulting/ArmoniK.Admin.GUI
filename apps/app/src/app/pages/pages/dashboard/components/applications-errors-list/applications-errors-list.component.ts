import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ApplicationError,
  Pagination,
} from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridStateInterface } from '@clr/angular';

/**
 * Display applications errors in list
 */
@Component({
  selector: 'app-pages-dashboard-applications-errors-list',
  templateUrl: './applications-errors-list.component.html',
  styleUrls: ['./applications-errors-list.component.scss'],
})
export class ApplicationsErrorsListComponent {
  @Input() applications: Pagination<ApplicationError> | null = null;
  @Input() loading = true;

  @Output() refresh = new EventEmitter<ClrDatagridStateInterface>();

  @Input() isSeqUp = false;
  @Output() clickSeqLink = new EventEmitter<string>();

  /**
   * Except text using ellipsis when longer than 100 characters
   *
   * @param text
   */
  excerpt(text: string): string {
    if (text.length > 100) {
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
