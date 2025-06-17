import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { TasksIndexService } from '@app/tasks/services/tasks-index.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { StatusCount, TaskSummaryFilters } from '@app/tasks/types';
import { EditNameLineData } from '@app/types/dialog';
import { DataFilterService } from '@app/types/services/data-filter.service';
import { ActionsToolbarGroupComponent } from '@components/actions-toolbar-group.component';
import { ActionsToolbarComponent } from '@components/actions-toolbar.component';
import { AutoRefreshButtonComponent } from '@components/auto-refresh-button.component';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { RefreshButtonComponent } from '@components/refresh-button.component';
import { SpinnerComponent } from '@components/spinner.component';
import { ManageGroupsDialogComponent } from '@components/statuses/manage-groups-dialog.component';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { GrpcSortFieldService } from '@services/grpc-sort-field.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';
import { UtilsService } from '@services/utils.service';
import { Observable, Subject, Subscription, catchError, merge, of, startWith, switchMap, tap } from 'rxjs';
import { CountLine, ManageGroupsDialogData, ManageGroupsDialogResult } from '../../types';
import { EditNameLineDialogComponent } from '../edit-name-line-dialog.component';
import { StatusesGroupCardComponent } from '../statuses-group-card.component';

@Component({
  selector: 'app-dashboard-task-status-line',
  templateUrl: './task-by-status-line.component.html',
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
      provide: DataFilterService,
      useClass: TasksFiltersService
    },
    GrpcSortFieldService,
    NotificationService,
  ],
  imports: [
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskByStatusLineComponent implements AfterViewInit,OnDestroy {
  readonly dialog = inject(MatDialog);
  readonly autoRefreshService = inject(AutoRefreshService);
  readonly iconsService = inject(IconsService);
  readonly taskGrpcService = inject(TasksGrpcService);
  private readonly notificationService = inject(NotificationService);

  @Input({ required: true }) line: CountLine;
  @Output() lineChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() lineDelete: EventEmitter<CountLine> = new EventEmitter<CountLine>();

  total: number;
  loading = signal<boolean>(false);
  data = signal<StatusCount[]>([]);

  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  subscriptions: Subscription = new Subscription();
  interval$: Observable<number> = this.autoRefreshService.createInterval(this.interval, this.stopInterval);

  ngAfterViewInit() {
    const mergeSubscription = merge(this.refresh, this.interval$).pipe(
      startWith(0),
      tap(() => (this.loading.set(true))),
      switchMap(() => this.taskGrpcService.countByStatus$(this.line.filters as TaskSummaryFilters).pipe(
        catchError((err: GrpcStatusEvent) => {
          console.error(err);
          this.notificationService.error('Could not load tasks by statuses');
          return of({status: undefined});
        })
      )),
    ).subscribe((data) => {
      this.data.set(data.status ?? []);
      this.total = this.data().reduce((acc, curr) => acc + curr.count, 0);
      this.loading.set(false);
    });
    this.subscriptions.add(mergeSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  autoRefreshTooltip(): string {
    return this.autoRefreshService.autoRefreshTooltip(this.line.interval);
  }

  onRefresh() {
    this.refresh.next();
  }

  onIntervalValueChange(value: number) {
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
    const dialogRef: MatDialogRef<EditNameLineDialogComponent> = this.dialog.open<EditNameLineDialogComponent, EditNameLineData>(EditNameLineDialogComponent, {
      data: {
        name: value
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.line.name = result;
      this.lineChange.emit();
    });
  }

  onDeleteLine(value: CountLine): void {
    this.lineDelete.emit(value);
  }

  onManageGroupsDialog() {
    const dialogRef: MatDialogRef<ManageGroupsDialogComponent, ManageGroupsDialogResult> = this.dialog.open<ManageGroupsDialogComponent, ManageGroupsDialogData, ManageGroupsDialogResult>(ManageGroupsDialogComponent, {
      data: {
        groups: this.line.taskStatusesGroups ?? [],
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

  onShowFiltersChange(value: boolean) {
    this.line.showFilters = value;
    this.lineChange.emit();
  }

  get taskByStatusFilters() {
    return this.line.filters as TaskSummaryFilters;
  }
}
