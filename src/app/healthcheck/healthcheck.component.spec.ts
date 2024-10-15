import { HealthStatusEnum } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { of, throwError } from 'rxjs';
import { HealthCheckComponent } from './healthcheck.component';
import { HealthCheckGrpcService } from './services/healthcheck-grpc.service';
import { ServiceHealth } from './types';

describe('HealthCheckComponent', () => {
  let component: HealthCheckComponent;

  const mockedData: ServiceHealth[] = [
    {
      healthy: HealthStatusEnum.HEALTH_STATUS_ENUM_UNSPECIFIED,
      message: 'mocked message',
      name: 'service 1'
    },
    {
      healthy: HealthStatusEnum.HEALTH_STATUS_ENUM_HEALTHY,
      message: 'another message',
      name: 'service 2',
    },
    {
      healthy: HealthStatusEnum.HEALTH_STATUS_ENUM_DEGRADED,
      message: '',
      name: 'service 3'
    },
    {
      healthy: HealthStatusEnum.HEALTH_STATUS_ENUM_UNHEALTHY,
      message: '',
      name: 'service 4'
    }
  ];

  const mockHealthCheckGrpcService = {
    list$: jest.fn((): unknown => of({services: mockedData})),
  };

  const mockNotificationService = {
    error: jest.fn(),
    success: jest.fn(),
  };

  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        HealthCheckComponent,
        { provide: HealthCheckGrpcService, useValue: mockHealthCheckGrpcService },
        { provide: NotificationService, useValue: mockNotificationService },
        AutoRefreshService,
        IconsService
      ]
    }).inject(HealthCheckComponent);
    component.ngAfterViewInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialisation', () => {
    it('should define interval$', () => {
      expect(component.interval$).toBeDefined();
    });
  });

  describe('On data fetch', () => {
    beforeEach(() => {
      component.interval.next(1);
    });

    it('should set the data', () => {
      expect(component.data).toEqual(mockedData);
    });

    it('should set the global status', () => {
      expect(component.globalStatus).toEqual(HealthStatusEnum.HEALTH_STATUS_ENUM_UNHEALTHY);
    });
  });

  describe('on data fetch error', () => {
    const error = new Error('mocked error');
    beforeEach(() => {
      mockHealthCheckGrpcService.list$.mockReturnValueOnce(throwError(() => error));
      component.ngAfterViewInit();
    });

    it('should console log the error', () => {
      expect(consoleSpy).toHaveBeenCalledWith(error);
    });

    it('should notify in case of error', () => {
      expect(mockNotificationService.error).toHaveBeenCalled();
    });

    it('should set global status to unspecified', () => {
      expect(component.globalStatus).toEqual(HealthStatusEnum.HEALTH_STATUS_ENUM_UNSPECIFIED);
    });
  });

  describe('setGlobalStatus', () => {
    beforeEach(() => {
      component.globalStatus = HealthStatusEnum.HEALTH_STATUS_ENUM_UNSPECIFIED;
    });

    it('should set global status to unhealthy', () => {
      component.data = mockedData;
      component.setGlobalStatus();
      expect(component.globalStatus).toEqual(HealthStatusEnum.HEALTH_STATUS_ENUM_UNHEALTHY);
    });

    it('should set global status to degraded', () => {
      component.data = mockedData.slice(0, 3);
      component.setGlobalStatus();
      expect(component.globalStatus).toEqual(HealthStatusEnum.HEALTH_STATUS_ENUM_DEGRADED);
    });

    it('should set global status to healthy', () => {
      component.data = mockedData.slice(0, 2);
      component.setGlobalStatus();
      expect(component.globalStatus).toEqual(HealthStatusEnum.HEALTH_STATUS_ENUM_HEALTHY);
    });
  });

  it('should get icon', () => {
    expect(component.getIcon('heart')).toEqual('favorite');
  });

  describe('getColor', () => {
    it('should return green for healthy', () => {
      expect(component.getColor(HealthStatusEnum.HEALTH_STATUS_ENUM_HEALTHY)).toEqual('green');
    });

    it('should return red for unhealthy', () => {
      expect(component.getColor(HealthStatusEnum.HEALTH_STATUS_ENUM_UNHEALTHY)).toEqual('red');
    });

    it('should return yellow for degraded', () => {
      expect(component.getColor(HealthStatusEnum.HEALTH_STATUS_ENUM_DEGRADED)).toEqual('yellow');
    });

    it('should return grey for unspecified', () => {
      expect(component.getColor(HealthStatusEnum.HEALTH_STATUS_ENUM_UNSPECIFIED)).toEqual('grey');
    });
  });

  describe('getToolTip', () => {
    it('should return healthy message', () => {
      expect(component.getToolTip(HealthStatusEnum.HEALTH_STATUS_ENUM_HEALTHY)).toEqual('Services are Healthy');
    });

    it('should return unhealthy message', () => {
      expect(component.getToolTip(HealthStatusEnum.HEALTH_STATUS_ENUM_UNHEALTHY)).toEqual('Services are Unhealthy');
    });

    it('should return degraded message', () => {
      expect(component.getToolTip(HealthStatusEnum.HEALTH_STATUS_ENUM_DEGRADED)).toEqual('Services are Degraded');
    });

    it('should return unspecified message', () => {
      expect(component.getToolTip(HealthStatusEnum.HEALTH_STATUS_ENUM_UNSPECIFIED)).toEqual('No data available for the services');
    });
  });

  describe('onMessageCopy', () => {
    it('should notify the user', () => {
      component.onMessageCopy();
      expect(mockNotificationService.success).toHaveBeenCalled();
    });
  });
});