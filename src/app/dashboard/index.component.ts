import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable, Subject, Subscription, merge, startWith, switchMap, tap } from 'rxjs';
import { TaskGrpcService } from '@app/tasks/services/task-grpc.service';
import { ActionsToolbarGroupComponent } from '@components/actions-toolbar-group.component';
import { ActionsToolbarComponent } from '@components/actions-toolbar.component';
import { AutoRefreshButtonComponent } from '@components/auto-refresh-button.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { PageSectionHeaderComponent } from '@components/page-section-header.component';
import { PageSectionComponent } from '@components/page-section.component';
import { RefreshButtonComponent } from '@components/refresh-button.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { StorageService } from '@services/storage.service';
import { StatusGroupCardComponent } from './components/StatusGroupCard.component';
import { DashboardIndexService } from './services/dashboard-index.service';
import { DashboardStorageService } from './services/dashboard-storage.service';
import { StatusCount, TasksStatusGroup } from './types';

@Component({
  selector: 'app-dashboard-index',
  template: `
<app-page-header [sharableURL]="sharableURL">
  <mat-icon matListItemIcon aria-hidden="true" fontIcon="dashboard"></mat-icon>
  <span>Dashboard</span>
</app-page-header>

<app-page-section>
  <app-page-section-header icon="adjust">
    Tasks by status
  </app-page-section-header>

  <mat-toolbar>
    <app-actions-toolbar>
      <app-actions-toolbar-group>
        <app-refresh-button [tooltip]="autoRefreshTooltip()" (refreshChange)="onRefresh()"></app-refresh-button>
        <mat-spinner diameter="30" strokeWidth="4" *ngIf="loadTasksStatus"></mat-spinner>
      </app-actions-toolbar-group>

      <app-actions-toolbar-group>
        <app-auto-refresh-button [intervalValue]="intervalValue" (intervalValueChange)="onIntervalValueChange($event)"></app-auto-refresh-button>

        <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Show more options">
          <mat-icon aria-hidden="true" fontIcon="more_vert"></mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="onToggleGroupsHeader()">Toggle Groups Header</button>
          <!-- TODO: Reorganize, rename and delete groups and status (in a modal) -->
          <!-- <button mat-menu-item (click)="onResetColumns()">Reset Columns</button>
          <button mat-menu-item (click)="onResetFilters()">Reset Filters</button> -->
        </mat-menu>
      </app-actions-toolbar-group>
    </app-actions-toolbar>
  </mat-toolbar>

  <div class="groups">
    <!-- TODO: Save all to the storage (using the storage servie) -->
    <!-- TODO: Allow drag and drop between group -->
    <!-- TODO: Allow to rename group -->
    <!-- TODO: Allow to delete a groupo -->
    <!-- TODO: Allow to delete a counter -->
    <app-status-group-card
      *ngFor="let group of statusGroups"
      [group]="group"
      [data]="data"
      [hideGroupHeaders]="hideGroupHeaders"
    ></app-status-group-card>
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
    PageSectionHeaderComponent,
    ActionsToolbarComponent,
    ActionsToolbarGroupComponent,
    RefreshButtonComponent,
    AutoRefreshButtonComponent,
    StatusGroupCardComponent,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy {
  hideGroupHeaders: boolean;
  statusGroups: TasksStatusGroup[] = [];
  data: StatusCount[] = [];
  total: number;

  intervalValue = 0;
  sharableURL = '/dashboard';

  loadTasksStatus = true;
  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  interval$: Observable<number> = this._autoRefreshService.createInterval(this.interval, this.stopInterval);

  subscriptions: Subscription = new Subscription();

  constructor(
    private _taskGrpcService: TaskGrpcService,
    private _dashboardIndexService: DashboardIndexService,
    private _autoRefreshService: AutoRefreshService
  ) {}

  ngOnInit(): void {
    this.statusGroups = this._dashboardIndexService.restoreCountersGroup();

    this.intervalValue = this._dashboardIndexService.restoreIntervalValue();
    this.hideGroupHeaders = this._dashboardIndexService.restoreHideGroupsHeader();
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



  autoRefreshTooltip(): string {
    // TODO: see table.service.ts:22 and resuse the function
    return 'Auto refresh';
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




}
