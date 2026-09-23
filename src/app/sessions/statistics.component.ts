import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HistogramData, HistogramField, ResultDateProperty, TaskDateProperty, TaskDurationProperty } from '@app/types/statistics';
import { ByteArrayService } from '@services/byte-array.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { Observable, Subscription, map } from 'rxjs';
import { HistogramCardComponent, HistogramLoader } from './components/histogram-card.component';
import { SessionsStatisticsService } from './services/sessions-statistics.service';

@Component({
  selector: 'app-session-statistics',
  templateUrl: 'statistics.component.html',
  styleUrl: 'statistics.component.scss',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    HistogramCardComponent,
  ],
  providers: [
    SessionsStatisticsService,
    ByteArrayService,
    NotificationService,
    Clipboard,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionStatisticsComponent implements OnInit, OnDestroy {
  id: string;

  private readonly route = inject(ActivatedRoute);
  private readonly iconsService = inject(IconsService);
  private readonly copyService = inject(Clipboard);
  private readonly notificationService = inject(NotificationService);

  readonly statisticsService = inject(SessionsStatisticsService);

  private readonly subscriptions = new Subscription();

  readonly tasksOverTime: HistogramLoader = (field, buckets) =>
    this.statisticsService.taskDateHistogram$(this.id, field as HistogramField<TaskDateProperty>, buckets);

  readonly tasksByDuration: HistogramLoader = (field, buckets) =>
    this.statisticsService.taskDurationHistogram$(this.id, field as HistogramField<TaskDurationProperty>, buckets);

  readonly resultsOverTime: HistogramLoader = (field, buckets) =>
    this.statisticsService.resultDateHistogram$(this.id, field as HistogramField<ResultDateProperty>, buckets);

  readonly resultsBySize: HistogramLoader = (_, buckets): Observable<HistogramData> =>
    this.statisticsService.resultSizeHistogram$(this.id, buckets);

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params.pipe(
        map(params => params['id']),
      ).subscribe(id => {
        this.id = id;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  copySessionId(): void {
    this.copyService.copy(this.id);
    this.notificationService.success('Session ID copied to clipboard');
  }
}
