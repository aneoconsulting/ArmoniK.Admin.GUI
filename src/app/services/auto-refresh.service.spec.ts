import { BehaviorSubject, Subject } from 'rxjs';
import { AutoRefreshService } from './auto-refresh.service';

describe('Auto-refresh service', () => {
  
  const service = new AutoRefreshService();
  
  it('Should run', () => {
    expect(service).toBeTruthy();
  });

  describe('AutoRefreshToolTip', () => {
    it('Should show the interval when precised', () => {
      expect(service.autoRefreshTooltip(1)).toBe('Auto-refresh every 1 seconds');
    });
    it('Should not show the interval when it is set to 0', () => {
      expect(service.autoRefreshTooltip(0)).toBe('Auto-refresh is disabled');
    });
    it('Should not show the interval when it is set below 0', () => {
      expect(service.autoRefreshTooltip(-1)).toBe('Auto-refresh is disabled');
    });
  });

  describe('createInterval', () => {

    const stopIntervalSubject: Subject<void> = new Subject();

    it('Should return an interval when a value is provided', () => {
      const intervalSubjet: BehaviorSubject<number> = new BehaviorSubject(1);

      service
        .createInterval(intervalSubjet, stopIntervalSubject)
        .subscribe(interval => expect(interval).toEqual(1000));
    });
    it('Should return an interval when 0 is provided', () => {
      const intervalSubjet: BehaviorSubject<number> = new BehaviorSubject(0);

      service
        .createInterval(intervalSubjet, stopIntervalSubject)
        .subscribe(interval => expect(interval).toEqual(0));
    });
    it('Should not return anything when no value is provided', () => {
      const intervalSubjet: Subject<number> = new Subject();

      service
        .createInterval(intervalSubjet, stopIntervalSubject)
        .subscribe(value => expect(value).toEqual(0));
    });
    it('Should not return anything when a negative value is provided', () => {
      const intervalSubjet: BehaviorSubject<number> = new BehaviorSubject(-1);

      service
        .createInterval(intervalSubjet, stopIntervalSubject)
        .subscribe(value => expect(value).toEqual(0));
    });
  });
});