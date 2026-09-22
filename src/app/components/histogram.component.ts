import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, effect, input, viewChild } from '@angular/core';
import { BarController, BarElement, CategoryScale, Chart, Legend, LinearScale, LogarithmicScale, Tooltip } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, LogarithmicScale, Tooltip, Legend);

const FALLBACK_COLOR = '#3f51b5';

@Component({
  selector: 'app-histogram',
  templateUrl: 'histogram.component.html',
  styleUrl: 'histogram.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistogramComponent implements OnDestroy {
  /** The N+1 bucket edges. The axis is continuous, so a bar spans its two edges. */
  readonly boundaries = input.required<number[]>();
  readonly counts = input.required<number[]>();
  readonly boundaryLabels = input<string[]>([]);
  readonly intervals = input<string[]>([]);
  readonly datasetLabel = input<string>('');
  readonly logarithmic = input<boolean>(false);

  /**
   * Not required: the query resolves after the first render, and the effect reruns when it does.
   */
  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  #chart: Chart | null = null;
  #logarithmic = false;

  constructor() {
    effect(() => {
      const canvas = this.canvasRef()?.nativeElement;
      const boundaries = this.boundaries();
      const counts = this.counts();
      const datasetLabel = this.datasetLabel();
      const logarithmic = this.logarithmic();

      if (!canvas || boundaries.length < 2) {
        return;
      }

      // A scale cannot change type in place, so switching axes rebuilds the chart.
      if (this.#chart && this.#logarithmic !== logarithmic) {
        this.#chart.destroy();
        this.#chart = null;
      }

      const points = this.points(boundaries, counts);

      if (this.#chart) {
        this.#chart.data.datasets[0].data = points;
        this.#chart.data.datasets[0].label = datasetLabel;
        this.#chart.options.scales!['x']!.min = boundaries[0];
        this.#chart.options.scales!['x']!.max = boundaries[boundaries.length - 1];
        this.#chart.update();
        return;
      }

      this.#logarithmic = logarithmic;
      this.#chart = new Chart(canvas, {
        type: 'bar',
        data: {
          datasets: [{ label: datasetLabel, data: points, backgroundColor: this.color(), barThickness: 'flex' }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          // Anywhere in the column, at any height: a bucket holding a single row is a bar one
          // pixel tall, which the default 'intersect' mode makes impossible to point at.
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                title: items => (items.length === 0 ? '' : this.intervals()[items[0].dataIndex] ?? ''),
              },
            },
          },
          scales: {
            y: logarithmic
              ? { type: 'logarithmic' }
              : { type: 'linear', beginAtZero: true, ticks: { precision: 0 } },
            // Continuous, so a boundary is drawn where it belongs: between two bars, never under
            // one. The ticks are pinned to the boundaries rather than to whatever round values the
            // scale would pick on its own.
            x: {
              type: 'linear',
              offset: false,
              min: boundaries[0],
              max: boundaries[boundaries.length - 1],
              afterBuildTicks: axis => {
                axis.ticks = this.boundaries().map(value => ({ value }));
              },
              ticks: {
                maxRotation: 90,
                autoSkip: true,
                callback: value => this.boundaryLabels()[this.boundaries().indexOf(Number(value))] ?? '',
              },
            },
          },
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.#chart?.destroy();
    this.#chart = null;
  }

  /** A bar is placed on the middle of its bucket, so that it spans both of its edges. */
  private points(boundaries: number[], counts: number[]): { x: number, y: number }[] {
    return counts.map((count, index) => ({
      x: (boundaries[index] + boundaries[index + 1]) / 2,
      y: count,
    }));
  }

  /**
   * The theme custom properties are declared on `body.<theme>` and custom properties only inherit
   * downward, so reading them off the documentElement would always miss.
   */
  private color(): string {
    const themeColor = getComputedStyle(document.body).getPropertyValue('--armonik-header-background').trim();
    return themeColor === '' ? FALLBACK_COLOR : themeColor;
  }
}
