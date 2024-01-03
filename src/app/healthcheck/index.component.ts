import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Observable, Subject, merge } from 'rxjs';
import { AutoRefreshButtonComponent } from '@components/auto-refresh-button.component';
import { RefreshButtonComponent } from '@components/refresh-button.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { HealthCheckGrpcService } from './services/healthcheck-grpc.service';

@Component({
  selector: 'app-healthcheck-index',
  standalone: true,
  template: `
  <app-auto-refresh-button [intervalValue]="intervalValue" (intervalValueChange)="onIntervalValueChange($event)" />
  <app-refresh-button tooltip="Refresh data" (refreshChange)="onRefresh()" />
  `,
  providers: [
    HealthCheckGrpcService,
    AutoRefreshService
  ],
  imports: [
    AutoRefreshButtonComponent,
    RefreshButtonComponent,
    MatButtonModule
  ]
})
export class IndexComponent implements OnInit {
  readonly #healthcheckGrpcService = inject(HealthCheckGrpcService);
  readonly #autoRefreshService = inject(AutoRefreshService);
  
  intervalValue: number = 5;

  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  interval$: Observable<number> = this.#autoRefreshService.createInterval(this.interval, this.stopInterval);

  ngOnInit() {
    merge(this.interval$, this.refresh).pipe().subscribe(() => console.log());
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
}