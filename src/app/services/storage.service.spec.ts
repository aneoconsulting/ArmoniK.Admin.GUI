import { TestBed } from '@angular/core/testing';
import { ExportedDefaultConfig, Key } from '@app/types/config';
import { DefaultConfigService } from './default-config.service';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  const mockItemData: Record<string, string> = {
    'navigation-sidebar': 'myItemData1',
    'navigation-theme': 'myItemData2'
  }; 
  const mockStorage = {
    length: 1,
    clear: jest.fn(),
    getItem: jest.fn(),
    key: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
    'navigation-sidebar': 'myItemData1',
    'navigation-theme': 'myItemData2'
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
      expect(service.getItem('navigation-sidebar')).toEqual({
        'value': 'myItemData1'
      });
    });

    it('Should return data if the parameters are corrects and parse is true', () => {
      expect(service.getItem('navigation-theme', true)).toEqual({
        'value': 'myItemData2'
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
            return {'13': 'sessions'};
          } 
          else {
            return JSON.stringify({'13': 'sessions'});
          }
        }
        else {
          return undefined;
        }
      });
      const expectedList = ['profile', 'divider', 'healthcheck', 'divider', 'dashboard', 'divider', 'applications', 'partitions', 'divider', 'sessions', 'tasks', 'results', 'divider', 'sessions'];
      const expectedResult: {[key: number]: string} = {};
      expectedList.forEach((value, index) => expectedResult[index] = value);
      expect(service.exportData()['navigation-sidebar'])
        .toEqual(expectedResult);
      expect(service.exportData()['applications-tasks-by-status'])
        .toEqual([
          { status: 4, color: '#4caf50' },
          { status: 5, color: '#ff0000' },
          { status: 6, color: '#ff6944' },
          { status: 11, color: '#ff9800' }
        ],);
    });

    it('Should use defu properly', () => {
      mockStorage.getItem.mockImplementationOnce((key: Key, parse) => {
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
      consoleSpy = jest.spyOn(console, 'warn').mockImplementationOnce(() => {return;});
    });

    it('should set item in case of a supported key and valid JSON', () => {
      service.importData('{"navigation-sidebar":"profile"}');
      expect(setItemSpy).toHaveBeenCalledWith('navigation-sidebar', 'profile');
      service.importData('{"navigation-sidebar":["profile", "divider", "sessions"]}');
      expect(setItemSpy).toHaveBeenCalledWith('navigation-sidebar', ['profile', 'divider', 'sessions']);
      service.importData('[{"navigation-sidebar":["profile", "divider", "sessions"]}, {"navigation-theme": "dark-green"}]');
      expect(setItemSpy).toHaveBeenCalledTimes(2);
    });

    it('Should throw a syntaxError in case of an invalid JSON data', () => {
      expect(() => {service.importData('Invalid-json-data');}).toThrow(SyntaxError);
      expect(() => {service.importData('{"still-some":Invalid-json-data}');}).toThrow(SyntaxError);
      expect(() => {service.importData('[{"navigation-sidebar":is-that-invalid-data?}, {"navigation-theme": "dark-green"}]');}).toThrow(SyntaxError);
    });

    it('should warn in case of an unsupported key.', () => {
      service.importData('{"unsuported-key": "some-value"}');
      expect(consoleSpy).toHaveBeenCalled();
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