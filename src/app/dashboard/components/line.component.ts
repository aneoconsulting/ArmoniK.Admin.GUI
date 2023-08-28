import { NgForOf, NgIf } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable, Subject, Subscription, merge, startWith, switchMap, tap } from 'rxjs';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { TasksIndexService } from '@app/tasks/services/tasks-index.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-status.service';
import { StatusCount, TaskSummaryColumnKey } from '@app/tasks/types';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { EditNameLineData, EditNameLineResult } from '@app/types/dialog';
import { Page } from '@app/types/pages';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';
import { UtilsService } from '@services/utils.service';
import { EditNameLineDialogComponent } from './edit-name-line-dialog.component';
import { ManageGroupsDialogComponent } from './manage-groups-dialog.component';
import { StatusesGroupCardComponent } from './statuses-group-card.component';
import { ActionsToolbarGroupComponent } from '../../components/actions-toolbar-group.component';
import { ActionsToolbarComponent } from '../../components/actions-toolbar.component';
import { AutoRefreshButtonComponent } from '../../components/auto-refresh-button.component';
import { PageSectionHeaderComponent } from '../../components/page-section-header.component';
import { PageSectionComponent } from '../../components/page-section.component';
import { RefreshButtonComponent } from '../../components/refresh-button.component';
import { SpinnerComponent } from '../../components/spinner.component';
import { Line, ManageGroupsDialogData, ManageGroupsDialogResult } from '../types';

@Component({
  selector: 'app-dashboard-line',
  template: `
<mat-toolbar>
  <mat-toolbar-row>
    <app-actions-toolbar>
      <app-actions-toolbar-group>
        <app-refresh-button [tooltip]="autoRefreshTooltip()" (refreshChange)="onRefresh()"></app-refresh-button>
        <app-spinner *ngIf="loadTasksStatus"></app-spinner>
      </app-actions-toolbar-group>

      <app-actions-toolbar-group>
        <app-auto-refresh-button [intervalValue]="line.interval" (intervalValueChange)="onIntervalValueChange($event)"></app-auto-refresh-button>

        <button  mat-icon-button [matMenuTriggerFor]="menu" aria-label="Show more options" i18n-aria-label matTooltip="More Options" i18n-matTooltip>
          <mat-icon class="add-button" aria-hidden="true" [fontIcon]="getIcon('more')"></mat-icon>
        </button>

        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="onToggleGroupsHeader()">
            <mat-icon aria-hidden="true" [fontIcon]="line.hideGroupsHeader ? getIcon('view') : getIcon('view-off')"></mat-icon>
            <span i18n>
              Toggle Groups Header
            </span>
          </button>
          <button mat-menu-item (click)="onManageGroupsDialog()">
            <mat-icon aria-hidden="true" [fontIcon]="getIcon('tune')"></mat-icon>
            <span i18n>
              Manage Groups
            </span>
          </button>
          <button mat-menu-item (click)="onEditNameLine(line.name)">
            <mat-icon aria-hidden="true"  [fontIcon]="getIcon('edit')"></mat-icon>
              <span i18n>
                Edit name line
              </span>
          </button>
          <button mat-menu-item (click)="onDeleteLine(line)">
              <mat-icon aria-hidden="true" [fontIcon]="getIcon('delete')"></mat-icon>
              <span i18n>
                Delete line
              </span>
          </button>
        </mat-menu>
        </app-actions-toolbar-group>
    </app-actions-toolbar>
  </mat-toolbar-row>

  <mat-toolbar-row>
    <app-filters-toolbar [filters]="line.filters" (filtersChange)="onFiltersChange($event)"></app-filters-toolbar>
  </mat-toolbar-row>
</mat-toolbar>

<div class="groups">
  <app-statuses-group-card
  *ngFor="let group of line.taskStatusesGroups"
  [group]="group"
  [data]="data"
  [hideGroupHeaders]="line.hideGroupsHeader"
  ></app-statuses-group-card>
</div>
  `,
  styles: [`
app-actions-toolbar {
  flex-grow: 1;
}

.groups {
  margin-top: 1rem;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}
    `],
  standalone: true,
  providers: [
    TasksStatusesService,
    ShareUrlService,
    QueryParamsService,
    TasksGrpcService,
    StorageService,
    AutoRefreshService,
    UtilsService,
    TasksIndexService,
    TasksGrpcService,
    TasksFiltersService,
    {
      provide: DATA_FILTERS_SERVICE,
      useClass: TasksFiltersService
    },
  ],
  imports: [
    PageSectionComponent,
    PageSectionHeaderComponent,
    ActionsToolbarComponent,
    RefreshButtonComponent,
    SpinnerComponent,
    ActionsToolbarGroupComponent,
    AutoRefreshButtonComponent,
    FiltersToolbarComponent,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    StatusesGroupCardComponent,
    NgIf,
    NgForOf
  ]
})
export class LineComponent implements OnInit, AfterViewInit,OnDestroy {
  readonly #dialog = inject(MatDialog);
  readonly #autoRefreshService = inject(AutoRefreshService);
  readonly #iconsService = inject(IconsService);
  readonly #taskGrpcService = inject(TasksGrpcService);
  readonly #tasksIndexService = inject(TasksIndexService);

  @Input({ required: true }) line: Line;
  @Output() lineChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() lineDelete: EventEmitter<Line> = new EventEmitter<Line>();

  total: number;
  loadTasksStatus = false;
  data: StatusCount[] = [];

  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  subscriptions: Subscription = new Subscription();
  interval$: Observable<number> = this.#autoRefreshService.createInterval(this.interval, this.stopInterval);

  ngOnInit(): void {
    this.loadTasksStatus = true;
  }

  ngAfterViewInit() {
    const mergeSubscription = merge(this.refresh, this.interval$).pipe(
      startWith(0),
      tap(() => (this.loadTasksStatus = true)),
      switchMap(() => this.#taskGrpcService.countByStatu$(this.line.filters)),
    ).subscribe((data) => {

      if (!data.status) {
        return;
      }

      this.data = data.status;
      this.total = data.status.reduce((acc, curr) => acc + curr.count, 0);

      this.loadTasksStatus = false;
    });

    this.subscriptions.add(mergeSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

  getPageIcon(name: Page): string {
    return this.#iconsService.getPageIcon(name);
  }

  autoRefreshTooltip(): string {
    return this.#autoRefreshService.autoRefreshTooltip(this.line.interval);
  }

  columnsLabels(): Record<TaskSummaryColumnKey, string> {
    return this.#tasksIndexService.columnsLabels;
  }

  onRefresh() {
    this.refresh.next();
  }

  onIntervalValueChange( value: number) {
    this.line.interval = value;

    if(value === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(value);
      this.refresh.next();
    }

    this.lineChange.emit();

  }

  onToggleGroupsHeader() {
    this.line.hideGroupsHeader = !this.line.hideGroupsHeader;
    this.lineChange.emit();

  }

  onEditNameLine(value: string) {
    const dialogRef: MatDialogRef<EditNameLineDialogComponent, EditNameLineResult> = this.#dialog.open<EditNameLineDialogComponent, EditNameLineData, EditNameLineResult>(EditNameLineDialogComponent, {
      data: {
        name: value
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.line.name = result.name;
      this.lineChange.emit();
    });

  }

  onDeleteLine(value: Line): void {
    this.lineDelete.emit(value);
  }

  onManageGroupsDialog() {
    const dialogRef: MatDialogRef<ManageGroupsDialogComponent, ManageGroupsDialogResult> = this.#dialog.open<ManageGroupsDialogComponent, ManageGroupsDialogData, ManageGroupsDialogResult>(ManageGroupsDialogComponent, {
      data: {
        groups: this.line.taskStatusesGroups,
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.line.taskStatusesGroups = result.groups;
      this.lineChange.emit();
    });

  }
  onFiltersChange(value: unknown[]) {
    this.line.filters = value as [];
    this.lineChange.emit();
    this.refresh.next();
  }
}
