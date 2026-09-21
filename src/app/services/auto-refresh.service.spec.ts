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

      const subscription = service
        .createInterval(intervalSubjet, stopIntervalSubject)
        .subscribe(interval => expect(interval).toEqual(1000));
      subscription.unsubscribe();
    });
    it('Should return an interval when 0 is provided', () => {
      const intervalSubjet: BehaviorSubject<number> = new BehaviorSubject(0);

      const subscription = service
        .createInterval(intervalSubjet, stopIntervalSubject)
        .subscribe(interval => expect(interval).toEqual(0));
      subscription.unsubscribe();
    });
    it('Should not return anything when no value is provided', () => {
      const intervalSubjet: Subject<number> = new Subject();

      const subscription = service
        .createInterval(intervalSubjet, stopIntervalSubject)
        .subscribe(value => expect(value).toEqual(0));
      subscription.unsubscribe();
    });
    it('Should not return anything when a negative value is provided', () => {
      const intervalSubjet: BehaviorSubject<number> = new BehaviorSubject(-1);

      const subscription = service
        .createInterval(intervalSubjet, stopIntervalSubject)
        .subscribe(value => expect(value).toEqual(0));
      subscription.unsubscribe();
    });
  });

  describe('createInterval visibility', () => {

    const setVisibility = (state: 'visible' | 'hidden') => {
      Object.defineProperty(document, 'visibilityState', { value: state, configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    };

    beforeEach(() => {
      jest.useFakeTimers();
      setVisibility('visible');
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('Should not emit while the tab is hidden', () => {
      const intervalSubject: Subject<number> = new Subject();
      const stopIntervalSubject: Subject<void> = new Subject();
      const spy = jest.fn();

      const subscription = service.createInterval(intervalSubject, stopIntervalSubject).subscribe(spy);
      intervalSubject.next(1);
      jest.advanceTimersByTime(3000);
      expect(spy).toHaveBeenCalledTimes(3);

      setVisibility('hidden');
      jest.advanceTimersByTime(60000);
      expect(spy).toHaveBeenCalledTimes(3);

      subscription.unsubscribe();
    });

    it('Should emit again when the tab becomes visible', () => {
      const intervalSubject: Subject<number> = new Subject();
      const stopIntervalSubject: Subject<void> = new Subject();
      const spy = jest.fn();

      const subscription = service.createInterval(intervalSubject, stopIntervalSubject).subscribe(spy);
      intervalSubject.next(1);
      setVisibility('hidden');
      jest.advanceTimersByTime(60000);
      expect(spy).not.toHaveBeenCalled();

      setVisibility('visible');
      jest.advanceTimersByTime(2000);
      expect(spy).toHaveBeenCalledTimes(2);

      subscription.unsubscribe();
    });

    it('Should stay stopped when the tab becomes visible after the interval has been stopped', () => {
      const intervalSubject: Subject<number> = new Subject();
      const stopIntervalSubject: Subject<void> = new Subject();
      const spy = jest.fn();

      const subscription = service.createInterval(intervalSubject, stopIntervalSubject).subscribe(spy);
      intervalSubject.next(1);
      stopIntervalSubject.next();

      setVisibility('hidden');
      jest.advanceTimersByTime(60000);
      setVisibility('visible');
      jest.advanceTimersByTime(60000);
      expect(spy).not.toHaveBeenCalled();

      subscription.unsubscribe();
    });
  });
});
