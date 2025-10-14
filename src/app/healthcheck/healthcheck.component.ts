import { HealthStatusEnum } from '@aneoconsultingfr/armonik.api.angular';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { AfterViewInit, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HealthCheckGrpcService } from '@app/healthcheck/services/healthcheck-grpc.service';
import { ServiceHealth } from '@app/healthcheck/types';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { Observable, Subject, catchError, of, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-healthcheck',
  templateUrl: './healthcheck.component.html',
  styleUrl: 'healthcheck.component.scss',
  imports: [
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatButtonModule,
    ClipboardModule,
  ],
  providers: [
    HealthCheckGrpcService,
    NotificationService,
    AutoRefreshService,
  ]
})
export class HealthCheckComponent implements AfterViewInit {
  readonly healthcheckGrpcService = inject(HealthCheckGrpcService);
  readonly notificationService = inject(NotificationService);
  readonly autoRefreshService = inject(AutoRefreshService);
  readonly iconsService = inject(IconsService);

  intervalValue: number = 5;

  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  interval$: Observable<number> = this.autoRefreshService.createInterval(this.interval, this.stopInterval);

  data: ServiceHealth[] | undefined;
  globalStatus: HealthStatusEnum = HealthStatusEnum.HEALTH_STATUS_ENUM_UNSPECIFIED;

  ngAfterViewInit(): void {
    this.interval$.pipe(
      startWith({}),
      switchMap(() => {
        return this.healthcheckGrpcService.list$();
      }),
      catchError((error: GrpcStatusEvent) => {
        console.error(error);
        this.notificationService.error($localize`Unable to get service health data`);
        this.globalStatus = HealthStatusEnum.HEALTH_STATUS_ENUM_UNSPECIFIED;
        return of(null);
      })
    ).subscribe((data) => {
      this.data = data?.services ?? undefined;
      this.setGlobalStatus();
    });
    this.handleAutoRefreshStart();
  }

  private handleAutoRefreshStart() {
    this.interval.next(this.intervalValue);
  }

  setGlobalStatus() {
    if (this.data) {
      let statusCount = 0;
      while (statusCount < this.data.length && this.globalStatus !== HealthStatusEnum.HEALTH_STATUS_ENUM_UNHEALTHY) {
        if (this.data[statusCount].healthy === HealthStatusEnum.HEALTH_STATUS_ENUM_HEALTHY && this.globalStatus !== HealthStatusEnum.HEALTH_STATUS_ENUM_DEGRADED) {
          this.globalStatus = HealthStatusEnum.HEALTH_STATUS_ENUM_HEALTHY;
        } else if (this.data[statusCount].healthy !== HealthStatusEnum.HEALTH_STATUS_ENUM_HEALTHY) {
          this.globalStatus = this.data[statusCount].healthy;
        }
        statusCount++;
      }
    }
  }

  getIcon(name: string) {
    return this.iconsService.getIcon(name);
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
      return $localize`Services are Healthy`;
    case HealthStatusEnum.HEALTH_STATUS_ENUM_UNHEALTHY:
      return $localize`Services are Unhealthy`;
    case HealthStatusEnum.HEALTH_STATUS_ENUM_DEGRADED:
      return $localize`Services are Degraded`;
    default:
      return $localize`No data available for the services`;
    }
  }

  onMessageCopy() {
    this.notificationService.success($localize`Message copied to clipboard`);
  }
}
