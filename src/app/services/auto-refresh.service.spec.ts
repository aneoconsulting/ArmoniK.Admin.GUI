import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { AutoRefreshService } from './auto-refresh.service';

describe('Auto-refresh service', () => {
  
  let service: AutoRefreshService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AutoRefreshService]
    });
    service = TestBed.inject(AutoRefreshService);
  });
  
  it('Should run', () => {
    expect(service).toBeTruthy();
  });

  describe('AutoRefreshToolTip', () => {
    it('Should indicates the interval when precised', () => {
      expect(service.autoRefreshTooltip(1)).toBe('Auto-refresh every 1 seconds');
    });
    it('Should not indicates the interval when it is set to 0', () => {
      expect(service.autoRefreshTooltip(0)).toBe('Auto-refresh is disabled');
    });
    it('Should not indicates the interval when it is set below 0', () => {
      expect(service.autoRefreshTooltip(-1)).toBe('Auto-refresh is disabled');
    });
  });

  describe('createInterval', () => {
    it('Should return an interval when a value is given', () => {
      const intervalSubjet: BehaviorSubject<number> = new BehaviorSubject(1);
      const stopIntervalSubject: Subject<void> = new Subject();

      service
        .createInterval(intervalSubjet, stopIntervalSubject)
        .subscribe(interval => expect(interval).toEqual(1000));
    });
    it('Should return an interval when 0 is given', () => {
      const intervalSubjet: BehaviorSubject<number> = new BehaviorSubject(0);
      const stopIntervalSubject: Subject<void> = new Subject();

      service
        .createInterval(intervalSubjet, stopIntervalSubject)
        .subscribe(interval => expect(interval).toEqual(0));
    });
    it('Should not return anything when no value is given', () => {
      const intervalSubjet: Subject<number> = new Subject();
      const stopIntervalSubject: Subject<void> = new Subject();

      service
        .createInterval(intervalSubjet, stopIntervalSubject)
        .subscribe(value => expect(value).toBeUndefined);
    });
    it('Should not return anything when a negative value is given', () => {
      const intervalSubjet: BehaviorSubject<number> = new BehaviorSubject(1);
      const stopIntervalSubject: Subject<void> = new Subject();

      service
        .createInterval(intervalSubjet, stopIntervalSubject)
        .subscribe(value => expect(value).toBeUndefined);
    });
  });
});