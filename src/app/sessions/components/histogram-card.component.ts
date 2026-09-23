import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { BUCKET_COUNTS, DEFAULT_BUCKET_COUNT, HistogramData, HistogramField } from '@app/types/statistics';
import { HistogramComponent } from '@components/histogram.component';
import { SpinnerComponent } from '@components/spinner.component';
import { IconsService } from '@services/icons.service';
import { Observable, Subject, Subscription, catchError, of, switchMap, tap } from 'rxjs';

export type HistogramLoader = (field: HistogramField | null, buckets: number) => Observable<HistogramData>;

@Component({
  selector: 'app-histogram-card',
  templateUrl: 'histogram-card.component.html',
  styleUrl: 'histogram-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatSelectModule,
    HistogramComponent,
    SpinnerComponent,
  ],
})
export class HistogramCardComponent implements OnInit, OnDestroy {
  readonly title = input.required<string>();
  readonly unit = input.required<string>();
  readonly fields = input<HistogramField[]>([]);
  readonly loader = input.required<HistogramLoader>();

  readonly bucketCounts = BUCKET_COUNTS;

  readonly selectedField = signal<HistogramField | null>(null);
  readonly bucketCount = signal<number>(DEFAULT_BUCKET_COUNT);
  /** Display only: a tall bar next to a bar of one hides the latter on a linear axis. */
  readonly logarithmic = signal<boolean>(false);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly histogram = signal<HistogramData | null>(null);

  /**
   * Counts are computed bucket by bucket: rows short of the total mean the server did not interpret
   * the bucket boundaries the way this page assumes. Only a shortfall is meaningful — the outer
   * buckets are open ended, so a session still running can answer more than the bounds announced.
   */
  readonly missing = computed(() => {
    const data = this.histogram();

    if (data === null || data.counts.length === 0) {
      return 0;
    }

    return Math.max(0, data.total - data.counts.reduce((sum, count) => sum + count, 0));
  });

  /** The server does not fill this field in: there is nothing to bin, yet rows do exist. */
  readonly unreported = computed(() => {
    const data = this.histogram();
    return data !== null && data.counts.length === 0 && data.total > 0;
  });

  private readonly compute$ = new Subject<void>();
  private readonly subscriptions = new Subscription();

  constructor(private readonly iconsService: IconsService) {}

  ngOnInit(): void {
    this.selectedField.set(this.fields()[0] ?? null);

    this.subscriptions.add(
      this.compute$.pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap(() => this.loader()(this.selectedField(), this.bucketCount()).pipe(
          catchError((error: Error) => {
            this.error.set(error.message);
            this.loading.set(false);
            return of(null);
          }),
        )),
      ).subscribe(data => {
        if (data !== null) {
          this.histogram.set(data);
          this.loading.set(false);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  compute(): void {
    this.compute$.next();
  }

  /**
   * Dropping the rendered data keeps the card honest: the controls above it always describe the
   * chart below, never a previous run.
   */
  invalidate(): void {
    this.histogram.set(null);
    this.error.set(null);
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }
}
