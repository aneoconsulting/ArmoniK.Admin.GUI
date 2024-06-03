import { HealthStatusEnum } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { IndexComponent } from './index.component';
import { HealthCheckGrpcService } from './services/healthcheck-grpc.service';
import { HealthCheckIndexService } from './services/healthcheck-index.service';
import { ServiceHealth } from './types';

describe('IndexComponent', () => {
  let component: IndexComponent;

  const mockedData: ServiceHealth[] = [
    {
      healthy: 0,
      message: '',
      name: 'service 1'
    },
    {
      healthy: 1,
      message: '',
      name: 'service 2',
    },
    {
      healthy: 2,
      message: '',
      name: 'service 3'
    },
    {
      healthy: 3,
      message: '',
      name: 'service 4'
    }
  ];

  const mockHealthCheckGrpcService = {
    list$: jest.fn(() => of({services: mockedData}))
  };

  const mockNotificationService = {
    error: jest.fn()
  };

  const mockHealthCheckIndexService = {
    restoreIntervalValue: jest.fn(() => {
      return 10;
    }),
    saveIntervalValue: jest.fn()
  };

  const consoleSpy = jest.spyOn(console, 'error');
  consoleSpy.mockImplementation(() => {});
  const error = new Error('Test error');

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        IndexComponent,
        {provide: HealthCheckGrpcService, useValue: mockHealthCheckGrpcService},
        AutoRefreshService,
        {provide: NotificationService, useValue: mockNotificationService},
        IconsService,
        {provide: HealthCheckIndexService, useValue: mockHealthCheckIndexService}
      ]
    }).inject(IndexComponent);
    component.ngOnInit();
    component.ngAfterViewInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should init properly', () => {
    expect(component.intervalValue).toEqual(10);
  });

  it('should list data', () => {
    expect(component.data).toEqual(mockedData);
  });

  it('should handle errors', () => {
    mockHealthCheckGrpcService.list$.mockImplementationOnce(() => {
      return throwError(() => error);
    });

    component.ngAfterViewInit();

    expect(consoleSpy).toHaveBeenCalledWith(error);
    expect(mockNotificationService.error).toHaveBeenCalledWith('Unable to get service health data');
    expect(component.data).toEqual(undefined);
  });

  describe('onIntervalValueChange', () => {

    it('should update intervalValue', () => {
      component.onIntervalValueChange(2);
      expect(component.intervalValue).toEqual(2);
    });

    it('should store intervalValue', () => {
      component.onIntervalValueChange(2);
      expect(mockHealthCheckIndexService.saveIntervalValue).toHaveBeenCalledWith(2);
    });

    it('should refresh data', () => {
      component.onIntervalValueChange(2);
      expect(mockHealthCheckGrpcService.list$).toHaveBeenCalled();
    });
  });

  it('should list data on refresh', () => {
    component.onRefresh();
    expect(mockHealthCheckGrpcService.list$).toHaveBeenCalled();
  });

  describe('handleAutoRefreshStart', () => {
    it('should update interval value', () => {
      const spy = jest.spyOn(component.interval, 'next');
      component.handleAutoRefreshStart();
      expect(spy).toHaveBeenCalledWith(component.intervalValue);
    });

    it('should stop refreshing', () => {
      const spy = jest.spyOn(component.stopInterval, 'next');
      component.intervalValue = 0;
      component.handleAutoRefreshStart();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should get pageIcon', () => {
    expect(component.getIcon()).toEqual('monitor_heart');
  });

  describe('getColor', () => {
    it('should be green for Healthy service', () => {
      expect(component.getColor(HealthStatusEnum.HEALTH_STATUS_ENUM_HEALTHY)).toEqual('green');
    });

    it('should be red for Unhealthy service', () => {
      expect(component.getColor(HealthStatusEnum.HEALTH_STATUS_ENUM_UNHEALTHY)).toEqual('red');
    });

    it('should be yellow for Degraded service', () => {
      expect(component.getColor(HealthStatusEnum.HEALTH_STATUS_ENUM_DEGRADED)).toEqual('yellow');
    });

    it('should be grey by default', () => {
      expect(component.getColor(HealthStatusEnum.HEALTH_STATUS_ENUM_UNSPECIFIED)).toEqual('grey');
    });
  });

  describe('getToolTip', () => {
    it('should provide healthy', () => {
      expect(component.getToolTip(HealthStatusEnum.HEALTH_STATUS_ENUM_HEALTHY)).toEqual('Service is Healthy');
    });

    it('should provide unhealthy', () => {
      expect(component.getToolTip(HealthStatusEnum.HEALTH_STATUS_ENUM_UNHEALTHY)).toEqual('Service is Unhealthy');
    });

    it('should provide degraded', () => {
      expect(component.getToolTip(HealthStatusEnum.HEALTH_STATUS_ENUM_DEGRADED)).toEqual('Service is Degraded');
    });

    it('should provide default', () => {
      expect(component.getToolTip(HealthStatusEnum.HEALTH_STATUS_ENUM_UNSPECIFIED)).toEqual('There is no data on the service');
    });
  });
});