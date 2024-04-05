import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApplicationsFiltersService } from '@app/applications/services/applications-filters.service';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { TasksIndexService } from '@app/tasks/services/tasks-index.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { AddLineDialogData, AddLineDialogResult, ReorganizeLinesDialogData, ReorganizeLinesDialogResult, SplitLinesDialogData, SplitLinesDialogResult } from '@app/types/dialog';
import { Page } from '@app/types/pages';
import { ActionsToolbarGroupComponent } from '@components/actions-toolbar-group.component';
import { ActionsToolbarComponent } from '@components/actions-toolbar.component';
import { AutoRefreshButtonComponent } from '@components/auto-refresh-button.component';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { PageSectionHeaderComponent } from '@components/page-section-header.component';
import { PageSectionComponent } from '@components/page-section.component';
import { RefreshButtonComponent } from '@components/refresh-button.component';
import { SpinnerComponent } from '@components/spinner.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { UtilsService } from '@services/utils.service';
import { AddLineDialogComponent } from './components/add-line-dialog.component';
import { ApplicationsLineComponent } from './components/lines/applications-line.component';
import { PartitionsLineComponent } from './components/lines/partitions-line.component';
import { TaskByStatusLineComponent } from './components/lines/task-by-status-line.component';
import { ReorganizeLinesDialogComponent } from './components/reorganize-lines-dialog.component';
import { SplitLinesDialogComponent } from './components/split-lines-dialog.component';
import { DashboardIndexService } from './services/dashboard-index.service';
import { DashboardStorageService } from './services/dashboard-storage.service';
import { Line, LineType } from './types';


@Component({
  selector: 'app-dashboard-index',
  templateUrl: './index.component.html',
  styles: [`
.fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;

  z-index: 50;

  display: flex;
  flex-direction: column-reverse;
  gap: 1rem;
}

.fab-actions {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.no-line {
  margin-top: 2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 2rem;
}

.lines {
  display: grid;
  gap: 4rem;

  /* Allow user to view tasks even with the add button */
  margin-bottom: 2rem
}
  `],
  standalone: true,
  providers: [
    TasksStatusesService,
    ShareUrlService,
    QueryParamsService,
    TasksGrpcService,
    StorageService,
    DashboardStorageService,
    DashboardIndexService,
    AutoRefreshService,
    TasksIndexService,
    TableService,
    TableURLService,
    TableStorageService,
    TasksByStatusService,
    UtilsService,
    TableService,
    TableURLService,
    TableStorageService,
    IconsService,
    FiltersService,
    ApplicationsFiltersService,
  ],
  imports: [
    NgFor,
    NgIf,
    JsonPipe,
    PageHeaderComponent,
    PageSectionComponent,
    SpinnerComponent,
    PageSectionHeaderComponent,
    ActionsToolbarComponent,
    ActionsToolbarGroupComponent,
    RefreshButtonComponent,
    AutoRefreshButtonComponent,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    FiltersToolbarComponent,
    TaskByStatusLineComponent,
    ApplicationsLineComponent,
    PartitionsLineComponent,
  ]
})
export class IndexComponent implements OnInit {
  readonly #iconsService = inject(IconsService);
  readonly #dialog = inject(MatDialog);
  readonly #shareURLService = inject(ShareUrlService);
  readonly #dashboardIndexService = inject(DashboardIndexService);

  lines: Line[];
  showFabActions = false;
  columns = 1;

  sharableURL = '';

  ngOnInit(): void {
    this.lines = this.#dashboardIndexService.restoreLines();
    this.sharableURL = this.#shareURLService.generateSharableURL(null, null);
    this.columns = this.#dashboardIndexService.restoreSplitLines();
  }

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

  getPageIcon(name: Page): string {
    return this.#iconsService.getPageIcon(name);
  }

  getLineIcon(name: LineType): string {
    switch (name) {
    case 'Tasks':
      return this.#iconsService.getPageIcon('tasks');
    case 'Applications':
      return this.#iconsService.getPageIcon('applications');
    case 'Partitions':
      return this.#iconsService.getPageIcon('partitions');
    case 'Results':
      return this.#iconsService.getPageIcon('results');
    case 'Sessions':
      return this.#iconsService.getPageIcon('sessions');
    case 'CountStatus':
      return this.#iconsService.getIcon('task-by-status');
    default:
      return this.#iconsService.getIcon('default');
    }
  }

  openFab() {
    this.showFabActions = !this.showFabActions;
  }

  onAddLineDialog() {
    const dialogRef = this.#dialog.open<AddLineDialogComponent, AddLineDialogData, AddLineDialogResult>(AddLineDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      else if (result.type === 'CountStatus') {
        this.lines.push({
          name: result.name,
          type: 'CountStatus',
          interval: 5,
          hideGroupsHeader: false,
          filters: [],
          taskStatusesGroups: [
            {
              name: 'Finished',
              color: '#00ff00',
              statuses: [
                TaskStatus.TASK_STATUS_COMPLETED,
                TaskStatus.TASK_STATUS_CANCELLED,
              ],
            },
            {
              name: 'Running',
              color: '#ffa500',
              statuses: [
                TaskStatus.TASK_STATUS_PROCESSING,
              ]
            },
            {
              name: 'Errors',
              color: '#ff0000',
              statuses: [
                TaskStatus.TASK_STATUS_ERROR,
                TaskStatus.TASK_STATUS_TIMEOUT,
              ]
            },
          ],
        });
        this.onSaveChange();
      }
      else {
        this.lines.push({
          name: result.name,
          type: result.type,
          interval: 5,
          filters: []
        });
      }
      this.onSaveChange();
    });
  }

  onReorganizeLinesDialog() {
    const dialogRef = this.#dialog.open<ReorganizeLinesDialogComponent, ReorganizeLinesDialogData, ReorganizeLinesDialogResult>(ReorganizeLinesDialogComponent, {
      data: {
        lines: structuredClone(this.lines),
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.lines) {
        this.lines = result.lines;
        this.onSaveChange();
      }
    });
  }

  onSplitLinesDialog() {
    const dialogRef = this.#dialog.open<SplitLinesDialogComponent, SplitLinesDialogData, SplitLinesDialogResult>(SplitLinesDialogComponent, {
      data: {
        columns: this.columns,
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.columns) {
        this.columns = result.columns;
        this.#dashboardIndexService.saveSplitLines(this.columns);
      }
    });
  }

  onDeleteLine(value: Line) {
    const index = this.lines.indexOf(value);
    if (index > -1) {
      this.lines.splice(index, 1);
    }
    this.onSaveChange();
  }

  onSaveChange() {
    this.#dashboardIndexService.saveLines(this.lines);
  }

  trackByLine(index: number, line: Line): string {
    return line.name + index;
  }
}
