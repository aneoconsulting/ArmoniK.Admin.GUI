import { TestBed } from '@angular/core/testing';
import { GrpcMessage, GrpcRequest } from '@ngx-grpc/common';
import { GrpcHandler } from '@ngx-grpc/core';
import { StorageService } from '@services/storage.service';
import { GrpcClientSettings, GrpcHostInterceptor } from './grpc.interceptor';

describe('GrpcHostInterceptor', () => {
  let interceptor: GrpcHostInterceptor;

  const mockStorageService = {
    setItem: jest.fn(),
    getItem: jest.fn(() => null),
    removeItem: jest.fn(),
  };

  beforeEach(() => {
    interceptor = TestBed.configureTestingModule({
      providers: [
        GrpcHostInterceptor,
        { provide: StorageService, useValue: mockStorageService },    
      ]
    }).inject(GrpcHostInterceptor);
  });

  it('should create', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should get the host-config stored item', () => {
      expect(mockStorageService.getItem).toHaveBeenCalledWith('host-config');
    });
  });

  describe('intercepting', () => {
    const grpcHandler = {
      handle: jest.fn()
    } as unknown as GrpcHandler;

    const request = {
      client: {
        settings: {
          host: ''
        }
      }
    } as unknown as GrpcRequest<GrpcMessage, GrpcMessage>;

    const newHost = 'some-url';

    beforeEach(() => {
      interceptor.host = newHost;
      interceptor.intercept(request, grpcHandler);
    });

    it('should update the request', () => {
      expect((request.client as GrpcClientSettings).settings.host).toEqual(newHost);
    });

    it('should handle the request', () => {
      expect(grpcHandler.handle).toHaveBeenCalledWith(request);
    });
  });

  describe('setting host', () => {
    const newHost = 'http://google.com';
    beforeEach(() => {
      interceptor.host = 'some-url';
    });

    it('should update the host config if it is valid', () => {
      interceptor.setHost(newHost);
      expect(interceptor.host).toEqual(newHost);
    });

    it('should store the host config if it is valid', () => {
      interceptor.setHost(newHost);
      expect(mockStorageService.setItem).toHaveBeenCalledWith('host-config', newHost);
    });

    it('should set the host config to null if the entry is null', () => {
      interceptor.setHost(null);
      expect(interceptor.host).toBeNull();
    });

    it('should clear the stored config if the entry is null', () => {
      interceptor.setHost(null);
      expect(mockStorageService.removeItem).toHaveBeenCalledWith('host-config');
    });
  });

  test('Clearing the host', () => {
    interceptor.clearHost();
    expect(mockStorageService.removeItem).toHaveBeenCalledWith('host-config');
  });

  describe('testing host configuration', () => {
    const initialHostConfig = 'init-host';
    const testedValue = 'test-host';
    const testFn = jest.fn();
    beforeEach(() => {
      interceptor.host = initialHostConfig;
      interceptor.test(testedValue, testFn);
    });

    it('should not update the host config', () => {
      expect(interceptor.host).toEqual(initialHostConfig);
    });

    it('should call the test function', () => {
      expect(testFn).toHaveBeenCalled();
    });
  });
});