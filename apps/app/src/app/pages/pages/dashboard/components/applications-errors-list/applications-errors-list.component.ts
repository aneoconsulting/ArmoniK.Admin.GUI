import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ApplicationError,
  Pagination,
} from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridStateInterface } from '@clr/angular';

/**
 * Display applications erros in list
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
  @Input() generateSeqUrl: (taskId: string) => string = () => '';

  /**
   * Return total number of applications event if there is no task (return 0)
   */
  get totalApplications(): number {
    return this.applications ? this.applications.meta.total : 0;
  }
}
