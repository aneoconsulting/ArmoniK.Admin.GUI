import { AfterViewInit, Component, Input, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { TasksStatusesService } from '@app/tasks/services/task-status.service';
import { ViewTasksByStatusComponent } from '@components/view-tasks-by-status.component';
import { SessionsGrpcService } from '../services/sessions-grpc.service';
import { StatusCount } from '../types';

@Component({
  selector: 'app-sessions-count-by-status',
  template: `
<app-view-tasks-by-status
  [loading]="loading"
  [statusesCounts]="statusCount"
  [defaultQueryParams]="{
    sessionId: sessionId,
  }"
>
</app-view-tasks-by-status>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [
    TasksStatusesService,
  ],
  imports: [
    ViewTasksByStatusComponent,
  ]
})
export class CountByStatusComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) sessionId: string;

  statusCount: StatusCount[] | null = null;

  loading = true;

  #sessionGrpcService = inject(SessionsGrpcService);

  subscriptions = new Subscription();

  ngAfterViewInit(): void {
    const subscription = this.#sessionGrpcService.countTasksByStatus$(this.sessionId)
      .subscribe((response) => {
        this.loading = false;
        this.statusCount = response.status ?? null;
      });

    this.subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
