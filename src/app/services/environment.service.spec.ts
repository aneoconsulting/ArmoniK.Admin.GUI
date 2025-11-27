import { TestBed } from '@angular/core/testing';
import { GRPC_INTERCEPTORS } from '@ngx-grpc/core';
import { DefaultConfigService } from './default-config.service';
import { EnvironmentService } from './environment.service';
import { StorageService } from './storage.service';

describe('EnvironmentService', () => {
  let service: EnvironmentService;

  const mockGrpcInterceptor = {
    setHost: jest.fn(),
  };

  const storedHostList = ['host-1', 'host-2'];
  const storedHost = 'host-1';
  const mockStorageService = {
    getItem: jest.fn((value): string | string[] | undefined => value === 'environments' ? structuredClone(storedHostList) : structuredClone(storedHost)),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };

  const mockDefaultConfigService = {
    environments: [],
    hostConfig: null,
  };

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        EnvironmentService,
        { provide: StorageService, useValue: mockStorageService },
        { provide: DefaultConfigService, useValue: mockDefaultConfigService },
        { provide: GRPC_INTERCEPTORS, useValue: mockGrpcInterceptor },
      ],
    }).inject(EnvironmentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('Initialisation', () => {
    describe('With stored values', () => {
      it('should set the hostList', () => {
        expect(service.hosts).toEqual(storedHostList);
      });

      it('should set the host', () => {
        expect(service.currentHost).toEqual(storedHost);
      });
    });

    describe('default values', () => {
      beforeEach(() => {
        mockStorageService.getItem.mockReturnValueOnce(undefined);
      });
      
      it('should return the default host list', () => {
        expect(service['getHostLists']()).toEqual(mockDefaultConfigService.environments);
      });

      it('should return null', () => {
        expect(service['getHost']()).toBeNull();
      });
    });
  });

  describe('selectHost', () => {
    beforeEach(() => {
      service.selectHost(null);
    });
    
    it('should set the host as the current host', () => {
      expect(service.currentHost).toBeNull();
    });

    it('should update the grpcInterceptor host', () => {
      expect(mockGrpcInterceptor.setHost).toHaveBeenCalledWith(null);
    });

    it('should remove the host config item from the storage', () => {
      expect(mockStorageService.removeItem).toHaveBeenCalledWith('host-config');
    });
  });

  describe('addEnvironment', () => {
    const newHost = 'host-3';
    beforeEach(() => {
      service.addEnvironment(newHost);
    });
    
    it('should push the new host to the host list', () => {
      expect(service.hosts).toEqual([...storedHostList, newHost]);
    });

    it('should save the environment list', () => {
      expect(mockStorageService.setItem).toHaveBeenCalledWith('environments', service.hosts);
    });

    it('should not add a host that is already included in the hosts array', () => {
      const spy = jest.spyOn(service.hosts, 'push');
      service.addEnvironment(newHost); // Already added via beforeEach
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('removeEnvironment', () => {
    describe('With existing host', () => {
      beforeEach(() => {
        service.removeEnvironment('host-2');
      });
    
      it('should remove the environment from the list', () => {
        expect(service.hosts.length).toEqual(storedHostList.length - 1);
      });

      it('should save the environment', () => {
        expect(mockStorageService.setItem).toHaveBeenCalledWith('environments', service.hosts);
      });
    });

    describe('With unexisting host', () => {
      beforeEach(() => {
        service.removeEnvironment('host-3');
      });

      it('should not remove the environment from the list', () => {
        expect(service.hosts).toEqual(storedHostList);
      });
    });
  });
});