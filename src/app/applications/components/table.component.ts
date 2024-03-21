import { ApplicationRawEnumField, FilterStringOperator, SessionTaskOptionEnumField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { TaskSummaryFilters } from '@app/tasks/types';
import { TableColumn } from '@app/types/column.type';
import { ApplicationData } from '@app/types/data';
import { TaskStatusColored, ViewTasksByStatusDialogData } from '@app/types/dialog';
import { Filter } from '@app/types/filters';
import { Page } from '@app/types/pages';
import { ActionTable } from '@app/types/table';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableActionsComponent } from '@components/table/table-actions.component';
import { TableCellComponent } from '@components/table/table-cell.component';
import { TableEmptyDataComponent } from '@components/table/table-empty-data.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { ViewTasksByStatusDialogComponent } from '@components/view-tasks-by-status-dialog.component';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { ApplicationsIndexService } from '../services/applications-index.service';
import { ApplicationRaw, ApplicationRawColumnKey, ApplicationRawFieldKey, ApplicationRawFilters, ApplicationRawListOptions } from '../types';

@Component({
  selector: 'app-application-table',
  standalone: true,
  template: `
<app-table-container>
  <table mat-table matSort [matSortActive]="options.sort.active" recycleRows matSortDisableClear [matSortDirection]="options.sort.direction" [dataSource]="dataSource" cdkDropList cdkDropListOrientation="horizontal" [cdkDropListDisabled]="lockColumns" (cdkDropListDropped)="onDrop($event)" i18n-aria-label aria-label="Applications Data Table">

    <ng-container *ngFor="let column of displayedColumns" [matColumnDef]="column.key">
      <!-- Header -->
      <th mat-header-cell mat-sort-header [disabled]="!column.sortable" *matHeaderCellDef cdkDrag appNoWrap>
        {{ column.name }}
        <button mat-icon-button *ngIf="column.type === 'count'" (click)="personalizeTasksByStatus()" i18n-matTooltip matTooltip="Personalize Tasks Status">
          <mat-icon aria-hidden="true" [fontIcon]="getIcon('tune')"></mat-icon>
        </button>
      </th>
      <!-- Columns -->
      <ng-container *ngIf="column.type !== 'actions'">
        <td mat-cell *matCellDef="let element" appNoWrap>
          <app-table-cell 
            [value$]="element.value$"
            [column]="column"
            [element]="element"
            [tasksStatusesColored]="tasksStatusesColored"
          />
        </td>
      </ng-container>
      <!-- Action -->
      <ng-container *ngIf="column.type === 'actions'">
        <td mat-cell *matCellDef="let element" appNoWrap>
         <app-table-actions [actions]="actions" [element]="element" />
        </td>
      </ng-container>
    </ng-container>

    <!-- Empty -->
    <tr *matNoDataRow>
      <td [attr.colspan]="displayedColumns.length">
        <app-table-empty-data/>
      </td>
    </tr>

    <tr mat-header-row *matHeaderRowDef="columnKeys; sticky: true"></tr>
    <tr mat-row *matRowDef="let row; columns: columnKeys;"></tr>
  </table>

  <mat-paginator [length]="total" [pageIndex]="options.pageIndex" [pageSize]="options.pageSize" [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of applications">
  </mat-paginator>
</app-table-container>
  `,
  styles: [
    
  ],
  providers: [
    ApplicationsIndexService,
    TasksByStatusService,
    MatDialog,
    IconsService,
    FiltersService
  ],
  imports: [
    TableActionsToolbarComponent,
    FiltersToolbarComponent,
    TableContainerComponent,
    MatPaginatorModule,
    TableEmptyDataComponent,
    MatMenuModule,
    CountTasksByStatusComponent,
    MatSortModule,
    NgFor,
    NgIf,
    MatTableModule,
    MatIconModule,
    RouterModule,
    EmptyCellPipe,
    DragDropModule,
    MatButtonModule,
    TableCellComponent,
    TableActionsComponent
  ]
})
export class ApplicationsTableComponent implements OnInit, AfterViewInit {

  @Input({required: true}) displayedColumns: TableColumn<ApplicationRawColumnKey>[] = [];
  @Input({required: true}) options: ApplicationRawListOptions;
  @Input({required: true}) total: number;
  @Input({required: true}) filters: ApplicationRawFilters;
  @Input() lockColumns = false;

  private _data: ApplicationData[] = [];
  get data(): ApplicationData[] {
    return this._data;
  }

  get columnKeys(): ApplicationRawColumnKey[] {
    return this.displayedColumns.map(column => column.key);
  }

  @Input({ required: true }) set data(entries: ApplicationRaw[]) {
    entries.forEach((entry, index) => {
      const application = this._data[index];
      if (application && application.raw.name === entry.name && application.raw.version === entry.version) {
        this._data[index].value$?.next(entry);
      } else {
        const lineData: ApplicationData = {
          raw: entry,
          queryTasksParams: this.createTasksByStatusQueryParams(entry.name, entry.version),
          filters: this.countTasksByStatusFilters(entry.name, entry.version),
          value$: new Subject<ApplicationRaw>()
        };
        this._data.splice(index, 1, lineData);
      }
    });
    this.dataSource.data = this._data;
  }

  @Output() optionsChange = new EventEmitter<never>();

  tasksStatusesColored: TaskStatusColored[] = [];
  dataSource = new MatTableDataSource<ApplicationData>(this._data);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  readonly _applicationsIndexService = inject(ApplicationsIndexService);
  readonly _tasksByStatusService = inject(TasksByStatusService);
  readonly _dialog = inject(MatDialog);
  readonly _iconsService = inject(IconsService);
  readonly _filtersService = inject(FiltersService);
  readonly _router = inject(Router);

  seeSessions$ = new Subject<ApplicationData>();
  seeSessionsSubscription = this.seeSessions$.subscribe(data => this._router.navigate(['/sessions'], { queryParams: this.createViewSessionsQueryParams(data.raw.name, data.raw.version) }));

  actions: ActionTable<ApplicationData>[] = [
    {
      label: $localize`See session`,
      icon: this.getPageIcon('sessions'),
      action$: this.seeSessions$
    },
  ];

  ngOnInit(): void {
    this.tasksStatusesColored = this._tasksByStatusService.restoreStatuses('applications');
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => {
      this.options.pageIndex = 0; // If the user change the sort order, reset back to the first page.
      this.options.sort = {
        active: this.sort.active as ApplicationRawFieldKey,
        direction: this.sort.direction
      };
      this.optionsChange.emit();
    });

    this.paginator.page.subscribe(() => {
      if (this.options.pageSize > this.paginator.pageSize) this._data = [];
      this.options.pageIndex = this.paginator.pageIndex;
      this.options.pageSize = this.paginator.pageSize;
      this.optionsChange.emit();
    });
  }

  getIcon(name: string): string {
    return this._iconsService.getIcon(name);
  }

  getPageIcon(name: Page): string {
    return this._iconsService.getPageIcon(name);
  }

  createViewSessionsQueryParams(name: string, version: string) {
    return {
      [`0-options-${SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`]: name,
      [`0-options-${SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`]: version,
    };
  }

  createTasksByStatusQueryParams(name: string, version: string) {
    if(this.filters.length === 0) {
      return {
        [`0-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`]: name,
        [`0-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`]: version
      };
    } else {
      const params: Record<string, string> = {};
      this.filters.forEach((filterAnd, index) => {
        filterAnd.forEach(filter => {
          if (!(filter.field === ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME && filter.operator === FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL) && 
          !(filter.field === ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE && filter.operator === FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL)) {
            const filterLabel = this.#createQueryParamFilterKey(filter, index);
            if (filterLabel && filter.value) params[filterLabel] = filter.value.toString();
          }
        });
        params[`${index}-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`] = name;
        params[`${index}-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`] = version;
      });
      return params;
    }
  }

  #createQueryParamFilterKey(filter: Filter<ApplicationRawEnumField, null>, orGroup: number): string | null {
    if (filter.field !== null && filter.operator !== null) {
      const taskField = this.#applicationsToTaskField(filter.field as ApplicationRawEnumField); // We transform it into an options filter for a task
      if (!taskField) return null;
      return this._filtersService.createQueryParamsKey<TaskOptionEnumField>(orGroup, 'options', filter.operator, taskField); 
    }
    return null;
  }

  #applicationsToTaskField(applicationField: ApplicationRawEnumField) {
    switch (applicationField) {
    case ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME:
      return TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME;
    case ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE:
      return TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAMESPACE;
    case ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_SERVICE:
      return TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_SERVICE;
    case ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_VERSION:
      return TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION;
    default:
      return null;
    }
  }

  personalizeTasksByStatus() {
    const dialogRef = this._dialog.open<ViewTasksByStatusDialogComponent, ViewTasksByStatusDialogData>(ViewTasksByStatusDialogComponent, {
      data: {
        statusesCounts: this.tasksStatusesColored,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.tasksStatusesColored = result;
      this._tasksByStatusService.saveStatuses('applications', result);
    });
  }

  countTasksByStatusFilters(applicationName: string, applicationVersion: string): TaskSummaryFilters {
    return [
      [
        {
          for: 'options',
          field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME,
          value: applicationName,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL
        },
        {
          for: 'options',
          field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION,
          value: applicationVersion,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL
        }
      ]
    ];
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);

    this._applicationsIndexService.saveColumns(this.displayedColumns.map(column => column.key));
  }
}