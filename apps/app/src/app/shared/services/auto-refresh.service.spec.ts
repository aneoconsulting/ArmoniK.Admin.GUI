import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AutoRefreshService } from './auto-refresh.service';

describe('AutoRefreshService', () => {
  let service: AutoRefreshService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AutoRefreshService],
    });
    router = TestBed.get(Router);
    service = TestBed.inject(AutoRefreshService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call "disable" when "ngOnDestroy" is called', () => {
    service.enable();
    service.ngOnDestroy();
    expect(service.interval).toBeNull();
  });

  it('should set new timer when "setTimer" is called', () => {
    service.setTimer(10_000);
    expect(service.timer).toEqual(10_000);
  });

  it('should restart interval when "setTimer" is called and interval enabled', () => {
    service.interval = setInterval(() => null, 10_000);
    const initialInterval = service.interval;
    service.setTimer(10_000);
    expect(service.interval).toBeTruthy();
    // Must be different instance (restarted with new timer)
    expect(service.interval).not.toEqual(initialInterval);
  });

  it('should not restart interval when "setTimer" is called and interval disabled', () => {
    service.interval = null;
    service.setTimer(10_000);
    expect(service.interval).toBeNull();
  });

  it('should enable interval when "enable" is called', () => {
    service.interval = null;
    service.enable();
    expect(service.interval).toBeTruthy();
  });

  it('should disable interval when "disable" is called', () => {
    service.interval = setInterval(() => null, 10_000);
    service.disable();
    expect(service.interval).toBeNull();
  });

  it('should clear interval when "disable" is called', () => {
    service.interval = setInterval(() => null, 10_000);
    const intervalId = service.interval;
    spyOn(window, 'clearInterval');
    service.disable();
    expect(window.clearInterval).toHaveBeenCalledWith(intervalId);
  });

  it('should not be enabled when interval is not set', () => {
    service.interval = null;
    expect(service.isEnabled()).toBeFalsy();
  });

  it('should be enabled when interval is set', () => {
    service.interval = setInterval(() => null, 10_000);
    expect(service.isEnabled()).toBeTruthy();
  });

  it('should toggle interval when "toggle" is called', () => {
    service.interval = null;
    service.toggle();
    expect(service.interval).toBeTruthy();
    service.toggle();
    expect(service.interval).toBeNull();
  });

  it('should throw an error when fn is call when fn is not set', () => {
    expect(function () {
      service.fn();
    }).toThrowError('AutoRefreshService.fn is not set');
  });

  it('should disable interval on routing', fakeAsync(() => {
    service.enable();
    router.navigate(['/']);
    tick();
    expect(service.interval).toBeNull();
  }));
});
