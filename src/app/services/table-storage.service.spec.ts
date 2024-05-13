import { TestBed } from '@angular/core/testing';
import { Key } from '@app/types/config';
import { StorageService } from './storage.service';
import { TableStorageService } from './table-storage.service';

describe('TableStorageService', () => {
  let service: TableStorageService;

  const mockStorageService = {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn()
  };

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        TableStorageService,
        { provide: StorageService, useValue: mockStorageService }
      ]
    }).inject(TableStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save data to the storage', () => {
    const key: Key = 'language';
    const data = 'fr';
    service.save(key, data);
    expect(mockStorageService.setItem).toHaveBeenCalledWith(key, data);
  });

  it('should restore data from the storage', () => {
    const data = 'en';
    mockStorageService.getItem.mockReturnValue(data);
    const key: Key = 'language';
    expect(service.restore(key)).toEqual(data);
  });

  it('should remove data from the storage', () => {
    const key: Key = 'language';
    service.remove(key);
    expect(mockStorageService.removeItem).toHaveBeenCalledWith(key);
  });
});