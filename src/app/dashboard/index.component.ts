import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable, Subject, Subscription, merge, startWith, switchMap, tap } from 'rxjs';
import { TaskGrpcService } from '@app/tasks/services/task-grpc.service';
import { TasksStatusesService } from '@app/tasks/services/task-status.service';
import { StatusCount } from '@app/tasks/types';
import { Page } from '@app/types/pages';
import { ActionsToolbarGroupComponent } from '@components/actions-toolbar-group.component';
import { ActionsToolbarComponent } from '@components/actions-toolbar.component';
import { AutoRefreshButtonComponent } from '@components/auto-refresh-button.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { PageSectionHeaderComponent } from '@components/page-section-header.component';
import { PageSectionComponent } from '@components/page-section.component';
import { RefreshButtonComponent } from '@components/refresh-button.component';
import { SpinnerComponent } from '@components/spinner.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';
import { ManageGroupsDialogComponent } from './components/manage-groups-dialog.component';
import { StatusesGroupCardComponent } from './components/statuses-group-card.component';
import { DashboardIndexService } from './services/dashboard-index.service';
import { DashboardStorageService } from './services/dashboard-storage.service';
import { TasksStatusesGroup } from './types';

@Component({
  selector: 'app-dashboard-index',
  template: `
<app-page-header [sharableURL]="sharableURL">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getPageIcon('dashboard')"></mat-icon>
  <span i18n="Page title"> Dashboard </span>
</app-page-header>

<app-page-section>
  <app-page-section-header icon="adjust">
    <span i18n="Section title"> Tasks by status </span>
  </app-page-section-header>

  <mat-toolbar>
    <app-actions-toolbar>
      <app-actions-toolbar-group>
        <app-refresh-button [tooltip]="autoRefreshTooltip()" (refreshChange)="onRefresh()"></app-refresh-button>
        <app-spinner *ngIf="loadTasksStatus"></app-spinner>
      </app-actions-toolbar-group>

      <app-actions-toolbar-group>
        <app-auto-refresh-button [intervalValue]="intervalValue" (intervalValueChange)="onIntervalValueChange($event)"></app-auto-refresh-button>

        <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Show more options">
          <mat-icon aria-hidden="true" [fontIcon]="getIcon('more')"></mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="onToggleGroupsHeader()">
            <mat-icon aria-hidden="true" [fontIcon]="hideGroupHeaders ? getIcon('view') : getIcon('view-off')"></mat-icon>
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
        </mat-menu>
      </app-actions-toolbar-group>
    </app-actions-toolbar>
  </mat-toolbar>

  <div class="groups">
    <app-statuses-group-card
      *ngFor="let group of statusGroups"
      [group]="group"
      [data]="data"
      [hideGroupHeaders]="hideGroupHeaders"
    ></app-statuses-group-card>
  </div>
</app-page-section>
  `,
  styles: [
    `
app-actions-toolbar {
  display: block;
  width: 100%;
}

.groups {
  margin-top: 1rem;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}
    `
  ],
  standalone: true,
  providers: [
    TasksStatusesService,
    ShareUrlService,
    QueryParamsService,
    TaskGrpcService,
    StorageService,
    DashboardStorageService,
    DashboardIndexService,
    AutoRefreshService,
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
    StatusesGroupCardComponent,
    MatDialogModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy {
  #iconsService = inject(IconsService);

  hideGroupHeaders: boolean;
  statusGroups: TasksStatusesGroup[] = [];
  data: StatusCount[] = [];
  total: number;

  intervalValue = 0;
  sharableURL = '';

  loadTasksStatus = true;
  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  interval$: Observable<number> = this._autoRefreshService.createInterval(this.interval, this.stopInterval);

  subscriptions: Subscription = new Subscription();

  constructor(
    private _dialog: MatDialog,
    private _shareURLService: ShareUrlService,
    private _taskGrpcService: TaskGrpcService,
    private _dashboardIndexService: DashboardIndexService,
    private _autoRefreshService: AutoRefreshService
  ) {}

  ngOnInit(): void {
    this.statusGroups = this._dashboardIndexService.restoreStatusGroups();

    this.intervalValue = this._dashboardIndexService.restoreIntervalValue();
    this.hideGroupHeaders = this._dashboardIndexService.restoreHideGroupsHeader();
    this.sharableURL = this._shareURLService.generateSharableURL(null, null);
  }

  ngAfterViewInit() {
    const mergeSubscription = merge(this.refresh, this.interval$).pipe(
      startWith(0),
      tap(() => (this.loadTasksStatus = true)),
      switchMap(() => this._taskGrpcService.countByStatu$()),
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
    return this._autoRefreshService.autoRefreshTooltip(this.intervalValue);
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

    this._dashboardIndexService.saveIntervalValue(value);
  }

  onToggleGroupsHeader() {
    this.hideGroupHeaders = !this.hideGroupHeaders;

    this._dashboardIndexService.saveHideGroupsHeader(this.hideGroupHeaders);
  }

  onManageGroupsDialog() {
    const dialogRef = this._dialog.open(ManageGroupsDialogComponent, {
      data: {
        groups: this.statusGroups,
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.statusGroups = result;
      this._dashboardIndexService.saveStatusGroups(this.statusGroups);
    });
  }

}
