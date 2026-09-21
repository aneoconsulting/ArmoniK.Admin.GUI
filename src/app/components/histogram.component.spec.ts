import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Chart, ChartConfiguration, TooltipItem } from 'chart.js';
import { HistogramComponent } from './histogram.component';

type MockChart = Chart & { update: jest.Mock, destroy: jest.Mock, config: ChartConfiguration<'bar'> };

const chartInstances = () => (Chart as unknown as { instances: MockChart[] }).instances;

@Component({
  template: '<app-histogram [labels]="labels()" [counts]="counts()" [intervals]="intervals()" [logarithmic]="logarithmic()" datasetLabel="Tasks" />',
  imports: [HistogramComponent],
})
class TestHostComponent {
  readonly labels = signal(['0s', '1s']);
  readonly counts = signal([1, 2]);
  readonly intervals = signal(['0s → 1s', '1s → 2s']);
  readonly logarithmic = signal(false);
}

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

  it('should draw the provided data', () => {
    const chart = chartInstances()[0];
    expect(chart.data.labels).toEqual(['0s', '1s']);
    expect(chart.data.datasets[0].data).toEqual([1, 2]);
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

  it('should fall back to the axis label when no range is known', async () => {
    fixture.componentInstance.intervals.set([]);
    await fixture.whenStable();

    const title = chartInstances()[0].config.options?.plugins?.tooltip?.callbacks?.title;
    const items = [{ dataIndex: 1, label: '1s' }] as TooltipItem<'bar'>[];

    expect(title?.call({} as never, items)).toEqual('1s');
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
    expect(chart.data.datasets[0].data).toEqual([5, 6]);
  });

  it('should destroy the chart when the component is destroyed', () => {
    const chart = chartInstances()[0];

    fixture.destroy();

    expect(chart.destroy).toHaveBeenCalled();
  });
});
