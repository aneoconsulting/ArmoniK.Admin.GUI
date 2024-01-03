import { HealthStatusEnum } from '@aneoconsultingfr/armonik.api.angular';
import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, Subject, catchError, merge, of, startWith, switchMap } from 'rxjs';
import { ActionsToolbarGroupComponent } from '@components/actions-toolbar-group.component';
import { AutoRefreshButtonComponent } from '@components/auto-refresh-button.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { RefreshButtonComponent } from '@components/refresh-button.component';
import { SpinnerComponent } from '@components/spinner.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { HealthCheckGrpcService } from './services/healthcheck-grpc.service';
import { HealthCheckIndexService } from './services/healthcheck-index.service';
import { ServiceHealth } from './types';

@Component({
  selector: 'app-healthcheck-index',
  template: `
<app-page-header>
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getPageIcon()"></mat-icon>
  <span i18n="Page title" i18n>HealthChecks</span>
</app-page-header>

<mat-toolbar>
  <mat-toolbar-row>
    <app-actions-toolbar-group>
      <app-auto-refresh-button [intervalValue]="intervalValue" (intervalValueChange)="onIntervalValueChange($event)" />
      <app-refresh-button tooltip="Refresh data" (refreshChange)="onRefresh()" />
      <app-spinner *ngIf="loading"/>
    </app-actions-toolbar-group>
  </mat-toolbar-row>
</mat-toolbar>

<ng-container *ngIf="data;else noData">
  <mat-card *ngFor="let service of data">
    <mat-card-header>
      <mat-card-title>
        {{service.name}}
        <span [style]="{'color':getColor(service.healthy)}" [matTooltip]="getToolTip(service.healthy)">&#10687;</span>
      </mat-card-title>
    </mat-card-header>
    <mat-card-content>
    <p>Message: {{service.message ? service.message : '-'}}<p>
    </mat-card-content>
  </mat-card>
</ng-container>

<ng-template #noData>
  <h2 *ngIf="!loading" i18n>No data to show</h2>
</ng-template>
  `,
  styles: [`
  mat-card {
    margin-bottom:10px;
  }

  mat-toolbar {
    margin-bottom: 20px;
  }
  `],
  standalone: true,
  providers: [
    HealthCheckGrpcService,
    AutoRefreshService,
    NotificationService,
    HealthCheckIndexService,
    MatSnackBar
  ],
  imports: [
    AutoRefreshButtonComponent,
    RefreshButtonComponent,
    ActionsToolbarGroupComponent,
    SpinnerComponent,
    PageHeaderComponent,
    MatButtonModule,
    MatIconModule,
    NgIf,
    NgFor,
    MatCardModule,
    MatTooltipModule,
    MatToolbarModule,
  ],
})
export class IndexComponent implements OnInit, AfterViewInit {
  readonly #healthcheckGrpcService = inject(HealthCheckGrpcService);
  readonly #autoRefreshService = inject(AutoRefreshService);
  readonly #notificationService = inject(NotificationService);
  readonly #iconsService = inject(IconsService);
  readonly #healthCheckIndexService = inject(HealthCheckIndexService);
  
  intervalValue: number;
  loading = true;
  data: ServiceHealth[] | undefined;

  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  interval$: Observable<number> = this.#autoRefreshService.createInterval(this.interval, this.stopInterval);

  ngOnInit() {
    this.intervalValue = this.#healthCheckIndexService.restoreIntervalValue();
  }

  ngAfterViewInit(): void {
    merge(this.interval$, this.refresh).pipe(
      startWith({}),
      switchMap(() => {
        this.loading = true;
        return this.#healthcheckGrpcService.list$().pipe(catchError((error) => {
          console.error(error);
          this.#notificationService.error($localize`Unable to get service health data`);
          return of(null);
        }));
      })
    ).subscribe((data) => {
      this.loading = false;
      if (data) {
        this.data = data.services;
      }
    });
    this.handleAutoRefreshStart();
  }

  onIntervalValueChange(newInterval: number) {
    this.intervalValue = newInterval;
    this.refresh.next();
  }

  onRefresh() {
    this.refresh.next();
  }

  handleAutoRefreshStart() {
    if (this.intervalValue === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(this.intervalValue);
    }
  }

  getPageIcon() {
    return this.#iconsService.getPageIcon('healthcheck');
  }

  getColor(healthy: HealthStatusEnum) {
    switch(healthy){
    case HealthStatusEnum.HEALTH_STATUS_ENUM_HEALTHY:
      return 'green';
    case HealthStatusEnum.HEALTH_STATUS_ENUM_UNHEALTHY:
      return 'red';
    case HealthStatusEnum.HEALTH_STATUS_ENUM_DEGRADED:
      return 'yellow';
    default:
      return 'grey';
    }
  }

  getToolTip(healthy: HealthStatusEnum) {
    switch(healthy){
    case HealthStatusEnum.HEALTH_STATUS_ENUM_HEALTHY:
      return $localize`Service is Healthy`;
    case HealthStatusEnum.HEALTH_STATUS_ENUM_UNHEALTHY:
      return $localize`Service is Unhealthy`;
    case HealthStatusEnum.HEALTH_STATUS_ENUM_DEGRADED:
      return $localize`Service is Degraded`;
    default:
      return $localize`There is no data on the service.`;
    }
  }
}