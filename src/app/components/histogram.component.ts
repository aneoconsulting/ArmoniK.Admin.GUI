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
  readonly labels = input.required<string[]>();
  readonly counts = input.required<number[]>();
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
      const labels = this.labels();
      const counts = this.counts();
      const datasetLabel = this.datasetLabel();
      const logarithmic = this.logarithmic();

      if (!canvas) {
        return;
      }

      // A scale cannot change type in place, so switching axes rebuilds the chart.
      if (this.#chart && this.#logarithmic !== logarithmic) {
        this.#chart.destroy();
        this.#chart = null;
      }

      if (this.#chart) {
        this.#chart.data.labels = labels;
        this.#chart.data.datasets[0].data = counts;
        this.#chart.data.datasets[0].label = datasetLabel;
        this.#chart.update();
        return;
      }

      this.#logarithmic = logarithmic;
      this.#chart = new Chart(canvas, {
        type: 'bar',
        data: {
          labels,
          datasets: [{ label: datasetLabel, data: counts, backgroundColor: this.color() }],
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
                title: items => (items.length === 0 ? '' : this.intervals()[items[0].dataIndex] ?? items[0].label),
              },
            },
          },
          scales: {
            y: logarithmic
              ? { type: 'logarithmic' }
              : { type: 'linear', beginAtZero: true, ticks: { precision: 0 } },
            x: { ticks: { maxRotation: 90 } },
          },
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.#chart?.destroy();
    this.#chart = null;
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
