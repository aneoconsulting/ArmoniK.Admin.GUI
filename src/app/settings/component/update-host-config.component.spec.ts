import { CheckHealthResponse } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { HealthCheckGrpcService } from '@app/healthcheck/services/healthcheck-grpc.service';
import { GRPC_INTERCEPTORS } from '@ngx-grpc/core';
import { IconsService } from '@services/icons.service';
import { Observable, of, throwError } from 'rxjs';
import { UpdateHostConfigComponent } from './update-host-config.component';

describe('UpdateHostConfigComponent', () => {
  let component: UpdateHostConfigComponent;

  const mockGrpcInterceptor = {
    host: 'some-host',
    checkRegex: /.*/,
    setHost: jest.fn(),
    clearHost: jest.fn(),
    test: jest.fn((value: string, fn: () => void) => {
      fn();
    })
  };

  const mockIconsService = {
    getIcon: jest.fn()
  };

  let healthResult$: Observable<CheckHealthResponse> = of({} as CheckHealthResponse);
  const mockHealthCheckService = {
    list$: jest.fn(() => healthResult$)
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        UpdateHostConfigComponent,
        { provide: GRPC_INTERCEPTORS, useValue: mockGrpcInterceptor },
        { provide: HealthCheckGrpcService, useValue: mockHealthCheckService },
        { provide: IconsService, useValue: mockIconsService },
      ]
    }).inject(UpdateHostConfigComponent);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should set the grpcInterceptor host value as the form value', () => {
      expect(component.hostForm.getRawValue()).toEqual(mockGrpcInterceptor.host);
    });
  });

  it('should set the validTest to null on input change', () => {
    component.validTest.set(true);
    component.inputChange();
    expect(component.validTest()).toBeNull();
  });

  it('should update the form config if the hostForm has a valid URL', () => {
    component.updateConfig();
    expect(mockGrpcInterceptor.setHost).toHaveBeenCalledWith(component.hostForm.getRawValue());
  });

  it('should get icons', () => {
    component.getIcon('heart');
    expect(mockIconsService.getIcon).toHaveBeenCalledWith('heart');
  });

  describe('testConnection', () => {
    it('should valid the test if it is correct', async () => {
      await component.testConnection();
      expect(component.validTest()).toBeTruthy();
    });

    it('should remove the error message if the test is correct', () => {
      component.testConnection();
      expect(component.connectionError()).toBeNull();
    });

    it('should not valid the test if it is incorrect', async () => {
      healthResult$ = throwError(() => { throw new Error(); });
      await component.testConnection();
      expect(component.validTest()).toBeFalsy();
    });

    it('should display an error message if there is an error', async () => {
      healthResult$ = throwError(() => { throw new Error(); });
      await component.testConnection();
      expect(component.connectionError()).toEqual('Could not connect.');
    });
  });

  describe('clearing host', () => {
    beforeEach(() => {
      component.clearHost();
    });

    it('should reset the form', () => {
      expect(component.hostForm.getRawValue()).toBeNull();
    });

    it('should clear the interceptor host', () => {
      expect(mockGrpcInterceptor.clearHost).toHaveBeenCalled();
    });
  });
});