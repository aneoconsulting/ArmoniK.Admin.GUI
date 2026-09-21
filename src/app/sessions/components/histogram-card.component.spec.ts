import { TestBed } from '@angular/core/testing';
import { HistogramData, HistogramField } from '@app/types/statistics';
import { IconsService } from '@services/icons.service';
import { Observable, Subject, throwError } from 'rxjs';
import { HistogramCardComponent, HistogramLoader } from './histogram-card.component';

describe('HistogramCardComponent', () => {
  let component: HistogramCardComponent;

  const fields: HistogramField[] = [
    { label: 'Created at', field: 3, property: 'createdAt' },
    { label: 'Ended at', field: 5, property: 'endedAt' },
  ];

  const data: HistogramData = { labels: ['a', 'b'], intervals: ['a → b', 'b → c'], counts: [1, 2], total: 3 };

  let loader: jest.Mock<Observable<HistogramData>, [HistogramField | null, number]>;

  const setInputs = (available: HistogramField[], histogramLoader: HistogramLoader) => {
    const inputs = component as unknown as { fields: () => HistogramField[], loader: () => HistogramLoader };
    inputs.fields = () => available;
    inputs.loader = () => histogramLoader;
  };

  beforeEach(() => {
    loader = jest.fn();

    component = TestBed.configureTestingModule({
      providers: [HistogramCardComponent, IconsService]
    }).inject(HistogramCardComponent);

    setInputs(fields, loader as unknown as HistogramLoader);
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should select the first field on init', () => {
    component.ngOnInit();
    expect(component.selectedField()).toEqual(fields[0]);
  });

  it('should not load anything before compute is clicked', () => {
    component.ngOnInit();
    expect(loader).not.toHaveBeenCalled();
    expect(component.histogram()).toBeNull();
  });

  it('should load the histogram with the selected field and bucket count', () => {
    const subject = new Subject<HistogramData>();
    loader.mockReturnValue(subject);
    component.ngOnInit();

    component.selectedField.set(fields[1]);
    component.bucketCount.set(50);
    component.compute();

    expect(loader).toHaveBeenCalledWith(fields[1], 50);
    expect(component.loading()).toBe(true);

    subject.next(data);
    expect(component.loading()).toBe(false);
    expect(component.histogram()).toEqual(data);
  });

  it('should cancel the previous computation', () => {
    const first = new Subject<HistogramData>();
    const second = new Subject<HistogramData>();
    loader.mockReturnValueOnce(first).mockReturnValueOnce(second);
    component.ngOnInit();

    component.compute();
    component.compute();

    expect(first.observed).toBe(false);
    expect(second.observed).toBe(true);
  });

  it('should expose the error and stop loading', () => {
    loader.mockReturnValue(throwError(() => new Error('Unreachable')));
    component.ngOnInit();

    component.compute();

    expect(component.error()).toEqual('Unreachable');
    expect(component.loading()).toBe(false);
  });

  it('should keep computing after an error', () => {
    loader.mockReturnValueOnce(throwError(() => new Error('Unreachable')));
    component.ngOnInit();
    component.compute();

    const subject = new Subject<HistogramData>();
    loader.mockReturnValue(subject);
    component.compute();
    subject.next(data);

    expect(component.error()).toBeNull();
    expect(component.histogram()).toEqual(data);
  });

  it('should report items missing from the computed range', () => {
    const subject = new Subject<HistogramData>();
    loader.mockReturnValue(subject);
    component.ngOnInit();
    component.compute();

    subject.next({ labels: ['a'], intervals: ['a → b'], counts: [1], total: 4 });

    expect(component.missing()).toBe(3);
  });

  it('should not report anything missing when the counts add up', () => {
    const subject = new Subject<HistogramData>();
    loader.mockReturnValue(subject);
    component.ngOnInit();
    component.compute();

    subject.next(data);

    expect(component.missing()).toBe(0);
  });

  it('should drop the rendered data when the controls change', () => {
    const subject = new Subject<HistogramData>();
    loader.mockReturnValue(subject);
    component.ngOnInit();
    component.compute();
    subject.next(data);

    component.invalidate();

    expect(component.histogram()).toBeNull();
    expect(component.error()).toBeNull();
  });

  it('should never report a negative shortfall', () => {
    const subject = new Subject<HistogramData>();
    loader.mockReturnValue(subject);
    component.ngOnInit();
    component.compute();

    // The last bucket is open ended, so a running session can answer more than the bounds announced.
    subject.next({ labels: ['a'], intervals: ['a → b'], counts: [10], total: 4 });

    expect(component.missing()).toBe(0);
  });

  it('should tell an unreported field apart from an empty session', () => {
    const subject = new Subject<HistogramData>();
    loader.mockReturnValue(subject);
    component.ngOnInit();
    component.compute();

    subject.next({ labels: [], intervals: [], counts: [], total: 139 });

    expect(component.unreported()).toBe(true);
    expect(component.missing()).toBe(0);
  });

  it('should not call an empty session unreported', () => {
    const subject = new Subject<HistogramData>();
    loader.mockReturnValue(subject);
    component.ngOnInit();
    component.compute();

    subject.next({ labels: [], intervals: [], counts: [], total: 0 });

    expect(component.unreported()).toBe(false);
  });

  it('should use a linear scale by default', () => {
    component.ngOnInit();
    expect(component.logarithmic()).toBe(false);
  });

  it('should switch scale without recomputing', () => {
    loader.mockReturnValue(new Subject<HistogramData>());
    component.ngOnInit();
    component.compute();
    loader.mockClear();

    component.logarithmic.set(true);

    expect(component.logarithmic()).toBe(true);
    expect(loader).not.toHaveBeenCalled();
  });

  it('should have no selected field when none is available', () => {
    setInputs([], loader as unknown as HistogramLoader);
    component.ngOnInit();
    expect(component.selectedField()).toBeNull();
  });
});
