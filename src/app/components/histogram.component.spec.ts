import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarController, BarElement, CategoryScale, Chart, ChartConfiguration, Legend, LinearScale, LogarithmicScale, Scale, Tooltip, TooltipItem } from 'chart.js';
import { HistogramComponent } from './histogram.component';

type MockChart = Chart & { update: jest.Mock, destroy: jest.Mock, config: ChartConfiguration<'bar'> };


const chartInstances = () => (Chart as unknown as { instances: MockChart[] }).instances;

@Component({
  template: '<app-histogram [boundaries]="boundaries()" [counts]="counts()" [boundaryLabels]="boundaryLabels()" [intervals]="intervals()" [logarithmic]="logarithmic()" datasetLabel="Tasks" />',
  imports: [HistogramComponent],
})
class TestHostComponent {
  readonly boundaries = signal([0, 1, 2]);
  readonly counts = signal([1, 2]);
  readonly boundaryLabels = signal(['0s', '1s', '2s']);
  readonly intervals = signal(['0s → 1s', '1s → 2s']);
  readonly logarithmic = signal(false);
}

// The component registers these at module load; a mock missing one would register undefined and
// every assertion below would still pass.
describe('chart.js components used by the histogram', () => {
  it('should all be available', () => {
    expect([BarController, BarElement, CategoryScale, LinearScale, LogarithmicScale, Tooltip, Legend])
      .not.toContain(undefined);
  });
});

describe('HistogramComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    chartInstances().length = 0;

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create a single chart on the canvas', () => {
    expect(chartInstances()).toHaveLength(1);
  });

  it('should place each bar on the middle of its bucket', () => {
    // A bar spans its two edges, so the boundaries land between the bars rather than under them.
    expect(chartInstances()[0].data.datasets[0].data).toEqual([{ x: 0.5, y: 1 }, { x: 1.5, y: 2 }]);
  });

  it('should span the whole boundary range', () => {
    const x = chartInstances()[0].config.options?.scales?.['x'];
    expect(x?.type).toEqual('linear');
    expect(x?.min).toBe(0);
    expect(x?.max).toBe(2);
  });

  it('should pin the ticks to the boundaries and label them', () => {
    const x = chartInstances()[0].config.options?.scales?.['x'];
    const axis = { ticks: [] } as unknown as Scale;

    x?.afterBuildTicks?.(axis);

    expect(axis.ticks).toEqual([{ value: 0 }, { value: 1 }, { value: 2 }]);
    const label = x?.ticks?.callback;
    expect(label?.call({} as never, 1, 1, [])).toEqual('1s');
  });

  it('should leave a gap between the bars', () => {
    // The grid line sits on the boundary; overriding these would hide it under the bars.
    const dataset = chartInstances()[0].config.data.datasets[0];
    expect(dataset.categoryPercentage).toBeUndefined();
    expect(dataset.barPercentage).toBeUndefined();
  });

  it('should not inflate the bars', () => {
    // 'auto' would inflate by 0.33px at a ratio of 1, drawing a sliver for an empty bucket.
    expect(chartInstances()[0].config.data.datasets[0].inflateAmount).toBe(0);
  });

  it('should trigger the tooltip anywhere in the column', () => {
    // A bucket holding a single row is a one pixel bar, unreachable with the default settings.
    expect(chartInstances()[0].config.options?.interaction).toEqual({ mode: 'index', intersect: false });
  });

  it('should title the tooltip with the bucket range', () => {
    const title = chartInstances()[0].config.options?.plugins?.tooltip?.callbacks?.title;
    const items = [{ dataIndex: 1, label: '1s' }] as TooltipItem<'bar'>[];

    expect(title?.call({} as never, items)).toEqual('1s → 2s');
  });

  it('should not title the tooltip when no range is known', async () => {
    // A continuous axis has no per bar label to fall back to: its label is the raw x value.
    fixture.componentInstance.intervals.set([]);
    await fixture.whenStable();

    const title = chartInstances()[0].config.options?.plugins?.tooltip?.callbacks?.title;
    const items = [{ dataIndex: 1, label: '1s' }] as TooltipItem<'bar'>[];

    expect(title?.call({} as never, items)).toEqual('');
  });

  it('should use a linear axis by default', () => {
    expect(chartInstances()[0].config.options?.scales?.['y']?.type).toEqual('linear');
  });

  it('should rebuild the chart on a logarithmic axis', async () => {
    fixture.componentInstance.logarithmic.set(true);
    await fixture.whenStable();

    // A scale cannot change type in place, hence a second instance.
    expect(chartInstances()).toHaveLength(2);
    expect(chartInstances()[0].destroy).toHaveBeenCalled();
    expect(chartInstances()[1].config.options?.scales?.['y']?.type).toEqual('logarithmic');
  });

  it('should update the existing chart instead of recreating it', async () => {
    const chart = chartInstances()[0];

    fixture.componentInstance.counts.set([5, 6]);
    await fixture.whenStable();

    expect(chartInstances()).toHaveLength(1);
    expect(chart.update).toHaveBeenCalled();
    expect(chart.data.datasets[0].data).toEqual([{ x: 0.5, y: 5 }, { x: 1.5, y: 6 }]);
  });

  it('should follow the boundaries when they move', async () => {
    const chart = chartInstances()[0];

    fixture.componentInstance.boundaries.set([10, 20, 30]);
    await fixture.whenStable();

    expect(chart.options.scales?.['x']?.min).toBe(10);
    expect(chart.options.scales?.['x']?.max).toBe(30);
    expect(chart.data.datasets[0].data).toEqual([{ x: 15, y: 1 }, { x: 25, y: 2 }]);
  });

  it('should destroy the chart when the component is destroyed', () => {
    const chart = chartInstances()[0];

    fixture.destroy();

    expect(chart.destroy).toHaveBeenCalled();
  });
});
