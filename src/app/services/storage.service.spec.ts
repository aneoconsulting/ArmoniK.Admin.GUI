import { TestBed } from '@angular/core/testing';
import { Key } from '@app/types/config';
import { DefaultConfigService } from './default-config.service';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  const mockStorage = {
    length: 1,
    clear: jest.fn(),
    getItem: jest.fn(),
    key: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn()
  };
  const mockItemData: Record<string, string> = {
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

  // TODO: exportData
  // TODO: importData
  // TODO: restoreKeys
  // Should be enough for the who code
});