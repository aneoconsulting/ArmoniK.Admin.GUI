import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { AddLineDialogData, AddLineDialogResult, ReorganizeLinesDialogData, ReorganizeLinesDialogResult, SplitLinesDialogData, SplitLinesDialogResult } from '@app/types/dialog';
import { PageHeaderComponent } from '@components/page-header.component';
import { PageSectionHeaderComponent } from '@components/page-section-header.component';
import { PageSectionComponent } from '@components/page-section.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { AddLineDialogComponent } from './components/add-line-dialog.component';
import { ApplicationsLineComponent } from './components/lines/applications-line.component';
import { PartitionsLineComponent } from './components/lines/partitions-line.component';
import { ResultsLineComponent } from './components/lines/results-line.component';
import { SessionsLineComponent } from './components/lines/sessions-line.component';
import { TaskByStatusLineComponent } from './components/lines/task-by-status-line.component';
import { TasksLineComponent } from './components/lines/tasks-line.component';
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

  z-index: 150;

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
    ShareUrlService,
    QueryParamsService,
    StorageService,
    DashboardStorageService,
    DashboardIndexService,
    AutoRefreshService,
    TableService,
    TableURLService,
    TableStorageService,
    UtilsService,
    TableURLService,
    TableStorageService,
    FiltersService,
    TasksStatusesService,
  ],
  imports: [
    PageHeaderComponent,
    PageSectionComponent,
    PageSectionHeaderComponent,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    TaskByStatusLineComponent,
    ApplicationsLineComponent,
    ResultsLineComponent,
    PartitionsLineComponent,
    SessionsLineComponent,
    TasksLineComponent,
  ]
})
export class IndexComponent implements OnInit {

  readonly #iconsService = inject(IconsService);
  readonly #dialog = inject(MatDialog);
  readonly #shareURLService = inject(ShareUrlService);
  readonly #dashboardIndexService = inject(DashboardIndexService);

  lines: Line[];
  showFabActions = false;
  hasOnlyOneLine = false;
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

  getLineIcon(name: LineType): string {
    switch (name) {
    case 'Tasks':
      return this.#iconsService.getIcon('tasks');
    case 'Applications':
      return this.#iconsService.getIcon('applications');
    case 'Partitions':
      return this.#iconsService.getIcon('partitions');
    case 'Results':
      return this.#iconsService.getIcon('results');
    case 'Sessions':
      return this.#iconsService.getIcon('sessions');
    case 'CountStatus':
      return this.#iconsService.getIcon('task-by-status');
    default:
      return this.#iconsService.getIcon('default');
    }
  }

  openFab() {
    this.showFabActions = !this.showFabActions;
    this.hasOnlyOneLine = this.lines.length === 1;
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
          groups: [],
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
        } as Line);
        this.onSaveChange();
      }
      else {
        this.lines.push({
          name: result.name,
          type: result.type,
          interval: 5,
          filters: [],
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
    this.hasOnlyOneLine = this.lines.length === 1;
    this.#dashboardIndexService.saveLines(this.lines);
  }
}
