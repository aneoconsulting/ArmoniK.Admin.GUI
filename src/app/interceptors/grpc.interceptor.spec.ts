import { TestBed } from '@angular/core/testing';
import { GrpcMessage, GrpcRequest } from '@ngx-grpc/common';
import { GrpcHandler } from '@ngx-grpc/core';
import { DefaultConfigService } from '@services/default-config.service';
import { StorageService } from '@services/storage.service';
import { GrpcClientSettings, GrpcHostInterceptor } from './grpc.interceptor';

describe('GrpcHostInterceptor', () => {
  let interceptor: GrpcHostInterceptor;

  const storedHost = 'http://armonik.eu';
  const mockStorageService = {
    setItem: jest.fn(),
    getItem: jest.fn((): string | undefined => storedHost),
    removeItem: jest.fn(),
  };

  const mockDefaultConfigService = {
    hostConfig: null,
  };

  beforeEach(() => {
    interceptor = TestBed.configureTestingModule({
      providers: [
        GrpcHostInterceptor,
        { provide: StorageService, useValue: mockStorageService },
        { provide: DefaultConfigService, useValue: mockDefaultConfigService }, 
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
    
    it('should set the default host if the stored item is undefined', () => {
      mockStorageService.getItem.mockReturnValueOnce(undefined);
      interceptor['initHost']();
      expect(interceptor.host).toEqual(mockDefaultConfigService.hostConfig);
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

    describe('with custom host', () => {
      beforeEach(() => {
        interceptor.host = storedHost;
        interceptor.intercept(request, grpcHandler);
      });

      it('should update the request', () => {
        expect((request.client as GrpcClientSettings).settings.host).toEqual(storedHost);
      });

      it('should handle the request', () => {
        expect(grpcHandler.handle).toHaveBeenCalledWith(request);
      });
    });

    describe('with null host', () => {
      it('should update the request', () => {
        interceptor.host = null;
        interceptor.intercept(request, grpcHandler);
        expect((request.client as GrpcClientSettings).settings.host).toEqual('');
      });
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
});