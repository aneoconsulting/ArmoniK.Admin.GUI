import { SessionStatus } from '@aneoconsultingfr/armonik.api.angular';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Timestamp } from '@ngx-grpc/well-known-types';
import { Observable, Subject, Subscription, catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { TaskOptions } from '@app/tasks/types';
import { TaskStatusColored, ViewObjectDialogData, ViewObjectDialogResult, ViewTasksByStatusDialogData } from '@app/types/dialog';
import { Page } from '@app/types/pages';
import { FiltersToolbarComponent } from '@components/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { ViewTasksByStatusDialogComponent } from '@components/view-tasks-by-status-dialog.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { UtilsService } from '@services/utils.service';
import { CountByStatusComponent } from './components/count-by-status.component';
import { ViewObjectDialogComponent } from './components/view-object-dialog.component';
import { SessionsGrpcService } from './services/sessions-grpc.service';
import { SessionsIndexService } from './services/sessions-index.service';
import { SessionsStatusesService } from './services/sessions-statuses.service';
import { SessionRaw, SessionRawColumnKey, SessionRawFieldKey, SessionRawFilter, SessionRawFilterField, SessionRawListOptions } from './types';

@Component({
  selector: 'app-sessions-index',
  template: `
<app-page-header [sharableURL]="sharableURL">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getIcon('sessions')"></mat-icon>
  <span i18n="Page title"> Sessions </span>
</app-page-header>

<mat-toolbar>
  <mat-toolbar-row>
    <app-table-actions-toolbar
      [loading]="isLoading"
      [refreshTooltip]="autoRefreshTooltip()"
      [intervalValue]="intervalValue"
      [columnsLabels]="columnsLabels()"
      [displayedColumns]="displayedColumns"
      [availableColumns]="availableColumns"
      (refresh)="onRefresh()"
      (intervalValueChange)="onIntervalValueChange($event)"
      (displayedColumnsChange)="onColumnsChange($event)"
      (resetColumns)="onColumnsReset()"
      (resetFilters)="onFiltersReset()"
    >
      <ng-container extra-menu-items>
        <button mat-menu-item (click)="personalizeTasksByStatus()" i18n>Personalize Tasks By Status</button>
      </ng-container>
    </app-table-actions-toolbar>
  </mat-toolbar-row>

  <mat-toolbar-row>
    <app-filters-toolbar [filters]="filters" [filtersFields]="availableFiltersFields" [columnsLabels]="columnsLabels()" (filtersChange)="onFiltersChange($event)"></app-filters-toolbar>
  </mat-toolbar-row>
</mat-toolbar>

<app-table-container>
  <table mat-table matSort [matSortActive]="options.sort.active" matSortDisableClear [matSortDirection]="options.sort.direction" [dataSource]="data" cdkDropList cdkDropListOrientation="horizontal" (cdkDropListDropped)="onDrop($event)">

    <ng-container *ngFor="let column of displayedColumns" [matColumnDef]="column">
      <!-- Header -->
      <th mat-header-cell mat-sort-header [disabled]="column === 'actions' || column === 'count' || objectColumns().includes(column)" *matHeaderCellDef cdkDrag> {{ columnToLabel(column) }} </th>
      <!-- Columns -->
      <ng-container *ngIf="column !== 'actions' && column !== 'sessionId' && column !== 'status' && column !== 'count' && !dateColumns().includes(column) && !objectColumns().includes(column)">
        <td mat-cell *matCellDef="let element">
          <!-- TODO: if it's an array, show the beginning and add a button to view more (using a modal) -->
          <span> {{ show(element, column) || '-' }} </span>
        </td>
      </ng-container>
      <!-- ID -->
      <ng-container *ngIf="column === 'sessionId'">
        <td mat-cell *matCellDef="let element">
          <a mat-button
            [routerLink]="['/tasks']"
            [queryParams]="{
              sessionId: element[column],
            }"
          >
            {{ element[column] }}
          </a>
        </td>
      </ng-container>
      <!-- Object -->
      <ng-container *ngIf="objectColumns().includes(column)">
       <td mat-cell *matCellDef="let element">
          <button mat-button (click)="viewObject(element[column])">
            <mat-icon matTooltip="View Object" fontIcon="visibility"></mat-icon>
          </button>
        </td>
      </ng-container>
      <!-- Date -->
      <ng-container *ngIf="dateColumns().includes(column)">
        <td mat-cell *matCellDef="let element">
          <ng-container *ngIf="element[column]; else noDate">
            {{ columnToDate(element[column]) | date: 'yyyy-MM-dd &nbsp;HH:mm:ss.SSS' }}
          </ng-container>
        </td>
      </ng-container>
      <!-- Status -->
      <ng-container *ngIf="column === 'status'">
        <td mat-cell *matCellDef="let element">
          <span> {{ statusToLabel(element[column]) }} </span>
        </td>
      </ng-container>
      <!-- Session's Tasks Count by Status -->
      <ng-container *ngIf="column === 'count'">
        <td mat-cell *matCellDef="let element">
          <app-sessions-count-by-status
            [statuses]="tasksStatusesColored"
            [sessionId]="element.sessionId"
          ></app-sessions-count-by-status>
        </td>
      </ng-container>
      <!-- Action -->
      <ng-container *ngIf="column === 'actions'">
        <td mat-cell *matCellDef="let element">
          <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Actions">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item [cdkCopyToClipboard]="element.sessionId" (cdkCopyToClipboardCopied)="onCopiedSessionId()">
              <mat-icon aria-hidden="true" fontIcon="content_copy"></mat-icon>
              <span i18n>Copy Session ID</span>
            </button>
            <a mat-menu-item [routerLink]="['/sessions', element.sessionId]">
              <mat-icon aria-hidden="true" fontIcon="visibility"></mat-icon>
              <span i18n>See session</span>
            </a>
            <button mat-menu-item (click)="onCancel(element.sessionId)">
              <mat-icon aria-hidden="true" fontIcon="cancel"></mat-icon>
              <span i18n>Cancel session</span>
            </button>
          </mat-menu>
        </td>
      </ng-container>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>

  <mat-paginator [length]="total" [pageIndex]="options.pageIndex" [pageSize]="options.pageSize" aria-label="Select page of sessions" i18n-aria-label>
    </mat-paginator>
</app-table-container>

<ng-template #noDate>
  <span> - </span>
</ng-template>
  `,
  styles: [`
app-table-actions-toolbar {
  flex-grow: 1;
}
  `],
  standalone: true,
  providers: [
    SessionsStatusesService,
    TasksByStatusService,
    IconsService,
    ShareUrlService,
    QueryParamsService,
    StorageService,
    TableURLService,
    TableStorageService,
    TableService,
    UtilsService,
    AutoRefreshService,
    SessionsIndexService,
    SessionsGrpcService,
    NotificationService,
  ],
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    RouterLink,
    DragDropModule,
    ClipboardModule,
    PageHeaderComponent,
    TableActionsToolbarComponent,
    FiltersToolbarComponent,
    CountByStatusComponent,
    TableContainerComponent,
    MatTooltipModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
    MatDialogModule,
  ]
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy {
  #tasksByStatusService = inject(TasksByStatusService);
  #notificationService = inject(NotificationService);
  #dialog = inject(MatDialog);

  displayedColumns: SessionRawColumnKey[] = [];
  availableColumns: SessionRawColumnKey[] = [];

  isLoading = true;
  data: SessionRaw[] = [];
  total = 0;

  options: SessionRawListOptions;

  filters: SessionRawFilter[] = [];
  availableFiltersFields: SessionRawFilterField[] = [];

  intervalValue = 0;
  sharableURL = '';

  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  interval$: Observable<number> = this._autoRefreshService.createInterval(this.interval, this.stopInterval);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  tasksStatusesColored: TaskStatusColored[] = [];

  subscriptions: Subscription = new Subscription();

  constructor(
    private _sessionsStatusesService: SessionsStatusesService,
    private _iconsService: IconsService,
    private _shareURLService: ShareUrlService,
    private _sessionsIndexService: SessionsIndexService,
    private _sessionsGrpcService: SessionsGrpcService,
    private _autoRefreshService: AutoRefreshService
  ) {}

  ngOnInit() {
    this.displayedColumns = this._sessionsIndexService.restoreColumns();
    this.availableColumns = this._sessionsIndexService.availableColumns;

    this.options = this._sessionsIndexService.restoreOptions();

    this.availableFiltersFields = this._sessionsIndexService.availableFiltersFields;
    this.filters = this._sessionsIndexService.restoreFilters();

    this.intervalValue = this._sessionsIndexService.restoreIntervalValue();

    this.sharableURL = this._shareURLService.generateSharableURL(this.options, this.filters);

    this.tasksStatusesColored = this.#tasksByStatusService.restoreStatuses('sessions');
  }

  ngAfterViewInit(): void {
    // If the user change the sort order, reset back to the first page.
    const sortSubscription = this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    const mergeSubscription = merge(this.sort.sortChange, this.paginator.page, this.refresh, this.interval$)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;

          const options: SessionRawListOptions = {
            pageIndex: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize,
            sort: {
              active: this.sort.active as SessionRawFieldKey,
              direction: this.sort.direction,
            },
          };
          const filters = this.filters;

          this.sharableURL = this._shareURLService.generateSharableURL(options, filters);
          this._sessionsIndexService.saveOptions(options);

          return this._sessionsGrpcService.list$(options, filters).pipe(catchError((error) => {
            console.error(error);
            this.#notificationService.error('Unable to fetch sessions');
            return of(null);
          }));
        }),
        map(data => {
          this.isLoading = false;
          this.total = data?.total ?? 0;

          const sessions = data?.sessions ?? [];
          return sessions;
        })
      )
      .subscribe(data => {
        this.data = data;
      });

    this.handleAutoRefreshStart();

    this.subscriptions.add(sortSubscription);
    this.subscriptions.add(mergeSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  show(session: SessionRaw, column: SessionRawColumnKey) {
    if (column.startsWith('options.')) {
      const optionColumn = column.replace('options.', '') as keyof TaskOptions;
      const options = session['options'] as TaskOptions | undefined;

      if (!options) {
        return null;
      }

      return options[optionColumn];
    }

    return session[column as keyof SessionRaw];
  }

  columnsLabels(): Record<SessionRawColumnKey, string> {
    return this._sessionsIndexService.columnsLabels;
  }

  columnToLabel(column: SessionRawColumnKey): string {
    return this._sessionsIndexService.columnToLabel(column);
  }

  columnToDate(element: Timestamp | undefined): Date | null {
    if (!element) {
      return null;
    }

    return element.toDate();
  }

  dateColumns(): SessionRawColumnKey[] {
    return this._sessionsIndexService.dateColumns;
  }

  objectColumns(): SessionRawColumnKey[] {
    return this._sessionsIndexService.objectColumns;
  }

  viewObject(element: TaskOptions) {
    this.#dialog.open<ViewObjectDialogComponent, ViewObjectDialogData, ViewObjectDialogResult>(ViewObjectDialogComponent, {
      data: {
        title: $localize`View Options`,
        object: element,
      }
    });
  }

  statusToLabel(status: SessionStatus): string {
    return this._sessionsStatusesService.statusToLabel(status);
  }

  getIcon(name: Page): string {
    return this._iconsService.getPageIcon(name);
  }

  onRefresh() {
    this.refresh.next();
  }

  onIntervalValueChange(value: number) {
    this.intervalValue = value;

    if (value === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(value);
      this.refresh.next();
    }

    this._sessionsIndexService.saveIntervalValue(value);
  }

  onColumnsChange(data: SessionRawColumnKey[]) {
    this.displayedColumns = [...data];

    this._sessionsIndexService.saveColumns(data);
  }

  onColumnsReset() {
    this.displayedColumns = this._sessionsIndexService.resetColumns();
  }

  onFiltersChange(filters: unknown[]) {
    this.filters = filters as SessionRawFilter[];

    this._sessionsIndexService.saveFilters(filters as SessionRawFilter[]);
    this.refresh.next();
  }

  onFiltersReset() {
    this.filters = this._sessionsIndexService.resetFilters();
    this.refresh.next();
  }

  autoRefreshTooltip() {
    return this._autoRefreshService.autoRefreshTooltip(this.intervalValue);
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);

    this._sessionsIndexService.saveColumns(this.displayedColumns);
  }

  onCopiedSessionId() {
    this.#notificationService.success('Session ID copied to clipboard');
  }

  onCancel(sessionId: string) {
    this._sessionsGrpcService.cancel$(sessionId).subscribe(
      () => this.refresh.next(),
    );
  }

  handleAutoRefreshStart() {
    if (this.intervalValue === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(this.intervalValue);
    }
  }

  personalizeTasksByStatus() {
    const dialogRef = this.#dialog.open<ViewTasksByStatusDialogComponent, ViewTasksByStatusDialogData>(ViewTasksByStatusDialogComponent, {
      data: {
        statusesCounts: this.tasksStatusesColored,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.tasksStatusesColored = result;
      this.#tasksByStatusService.saveStatuses('sessions', result);
    });
  }
}
