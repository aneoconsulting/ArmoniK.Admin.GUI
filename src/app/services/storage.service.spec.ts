import { TestBed } from '@angular/core/testing';
import { ExportedDefaultConfig, Key } from '@app/types/config';
import { DefaultConfigService } from './default-config.service';
import { StorageService } from './storage.service';
import pkg from '../../../package.json';

describe('StorageService', () => {
  let service: StorageService;
  const keys: Key[] = ['navigation-sidebar', 'navigation-theme'];
  const mockItemData: Record<string, unknown> = {
    'navigation-sidebar': {
      '0': 'profile',
      '1': 'divider',
      '2': 'healthcheck',
      '3': 'divider',
      '4': 'dashboard',
      '5': 'divider',
      '6': 'applications',
      '7': 'partitions',
      '8': 'divider',
      '9': 'sessions',
      '10': 'tasks',
      '11': 'results',
      '12': 'divider',
      '13': 'sessions',
    },
    'navigation-theme': 'indigo-pink'
  }; 
  const mockStorage = {
    length: 1,
    clear: jest.fn(),
    getItem: jest.fn(),
    key: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
    ...mockItemData,
  };

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        {provide: Storage, useValue: mockStorage},
        DefaultConfigService,
        StorageService
      ]
    }).inject(StorageService);
  });

  it('should run', () => {
    expect(service).toBeTruthy();
  });

  it('Should return its length', () => {
    expect(service.length).toEqual(1);
  });

  it('should clear', () => {
    service.clear();
    expect(mockStorage.clear).toHaveBeenCalled();
  });

  describe('getItem', () => {

    beforeEach(() => {
      mockStorage.getItem.mockImplementationOnce((key: Key) => {
        const result = mockItemData[key];
        return result ? {value: result} : undefined;
      });
    });

    it('Should call storage.getItem', () => {
      service.getItem('navigation-sidebar');
      expect(mockStorage.getItem).toHaveBeenCalled();
    });

    it('Should return data if the parameters are corrects', () => {
      const key = 'navigation-sidebar';
      expect(service.getItem(key)).toEqual({
        'value': mockItemData[key]
      });
    });

    it('Should return data if the parameters are corrects and parse is true', () => {
      const key = 'navigation-theme';
      expect(service.getItem(key, true)).toEqual({
        'value': mockItemData[key]
      });
    });

    it('Should return null if the parameters are incorrects', () => {
      expect(service.getItem('navigation-external-services')).toBeNull();
    });
  });

  describe('key', () => {
    beforeEach(() => {
      mockStorage.key.mockImplementationOnce((index: number) => {
        const keys = Object.keys(mockItemData);
        return keys[index] ?? null;
      });
    });

    it('Should return a value when the key index is correct', () => {
      expect(service.key(0)).toEqual('navigation-sidebar');
    });

    it('Should return null when the key index is correct', () => {
      expect(service.key(2)).toBeNull();
    });
  });

  it('removeItem', () => {
    service.removeItem('applications-options');
    expect(mockStorage.removeItem).toHaveBeenCalled();
    expect(mockStorage.removeItem).toHaveBeenCalledWith('applications-options');
  });

  describe('setItem', () => {
    beforeEach(() => {
      mockStorage.setItem.mockImplementationOnce((key: Key, data: unknown) => {
        return {
          key: key,
          data: data
        };
      });
    });

    it('Should add a specific string item', () => {
      service.setItem('applications-options', 'my_value');
      expect(mockStorage.setItem).toHaveReturnedWith({
        key: 'applications-options',
        data: 'my_value'
      });
    });

    it('Should add a specific item', () => {
      service.setItem('applications-options', {data: 1});
      expect(mockStorage.setItem).toHaveReturnedWith({
        key: 'applications-options',
        data: '{"data":1}'.replaceAll('\\', '')
      });
    });

    it('Should add a specific null item', () => {
      service.setItem('applications-options', {data: null});
      expect(mockStorage.setItem).toHaveReturnedWith({
        key: 'applications-options',
        data: '{"data":null}'.replaceAll('\\', '')
      });
    });
  });

  describe('exportData', () => {
    it('Should export properly', () => {
      mockStorage.getItem.mockImplementationOnce((key: Key, parse) => {
        const result = mockItemData[key];
        if(result) {
          if(!parse) {
            return result;
          } 
          else {
            return JSON.stringify(result);
          }
        }
        else {
          return undefined;
        }
      });
      const exportedData = service.exportData();
      expect(exportedData[keys[0]]).toEqual(mockItemData[keys[0]]);
    });

    it('Should use defu properly', () => {
      mockStorage.getItem.mockImplementationOnce((key: Key, parse: boolean) => {
        const result = mockItemData[key];
        if (!parse) return result ? [{
          '0': 'profile',
          '1': 'divider',
          '2': 'dashboard',
          '3': 'sessions'
        }] : undefined;
        else return result ? JSON.stringify([{
          '0': 'profile',
          '1': 'divider',
          '2': 'dashboard',
          '3': 'sessions'
        }]) : undefined;
      });
      expect(service.exportData()['navigation-sidebar'])
        .toEqual([{
          '0': 'profile',
          '1': 'divider',
          '2': 'dashboard',
          '3': 'sessions'
        }]);
    });
  });

  describe('importData', () => {
    let setItemSpy: jest.SpyInstance;
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      setItemSpy = jest.spyOn(service, 'setItem').mockImplementation();
      consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    });

    it('should set item in case of a supported key and valid JSON', () => {
      service.importData(`{"version": "${pkg.version}", "navigation-sidebar":"profile"}`);
      expect(setItemSpy).toHaveBeenCalledWith('navigation-sidebar', 'profile');
      service.importData(`{"version": "${pkg.version}", "navigation-sidebar":["profile", "divider", "sessions"]}`);
      expect(setItemSpy).toHaveBeenCalledWith('navigation-sidebar', ['profile', 'divider', 'sessions']);
      service.importData(`[{"version": "${pkg.version}", "navigation-sidebar": ["profile"]}, {"version": "${pkg.version}", "navigation-theme": "dark-green"}]`);
      expect(setItemSpy).toHaveBeenCalled();
    });

    it('should warn in case of an unsupported key.', () => {
      const key = 'unsuported-key';
      service.importData(`{"version": "${pkg.version}", "${key}": "some-value"}`);
      expect(consoleSpy).toHaveBeenCalledWith(`Key "${key}" is not supported`);
    });

    it('should throw errors if the data has no "version" key', () => {
      expect(() => service.importData('{"navigation-sidebar":"profile"}')).toThrow();
      expect(() => service.importData('[{"navigation-sidebar":"profile"}]')).toThrow();
    });

    it('should throw erros if the data has a version different from the current version', () => {
      const version = '0.0.1';
      expect(() => service.importData(`{"version": "${version}", "navigation-sidebar":["profile"]}`)).toThrow();
    });

    it('should allow to override the data', () => {
      jest.spyOn(service, 'getItem').mockImplementation(() => true);
      service.importData(`{"version": "${pkg.version}", "navigation-sidebar":"profile"}`, false);
      expect(setItemSpy).not.toHaveBeenCalled();
    });

    it('should allow to not parse the object', () => {
      const data = {
        version: pkg.version,
        'navigation-sidebar': 'profile'
      };
      service.importData(data, true, false);
      expect(setItemSpy).toHaveBeenCalledWith('navigation-sidebar', 'profile');
    });
  });

  it('restoreKeys should create a set of the keys', () => {
    const result: Set<Key> = new Set(['navigation-sidebar', 'navigation-theme']);
    expect(service.restoreKeys()).toEqual(result);
  });

  it('should import data from server without override local data', () => {
    const mockData: Partial<ExportedDefaultConfig> = {
      'navigation-sidebar': 'profile',
      'navigation-theme': 'dark-green'
    };
    const setItemSpy = jest.spyOn(service, 'setItem');
    jest.spyOn(service, 'getItem').mockImplementation((key: Key) => {
      if (key === 'navigation-theme') {
        return {'navigation-theme': 'deeppurple-amber'};
      }
      return null;
    });
    service.importConfigurationFromServer(mockData);
    expect(setItemSpy).toHaveBeenCalledTimes(1);
  });
});