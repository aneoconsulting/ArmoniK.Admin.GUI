import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.servcie';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StorageService,
        {
          provide: Storage,
          useValue: {
            getItem: jasmine.createSpy('getItem').and.returnValue('value'),
            setItem: jasmine.createSpy('setItem'),
          },
        },
      ],
    });
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the item from the storage', () => {
    const storage = TestBed.inject(Storage);

    expect(service.get('key')).toEqual('value');
    expect(storage.getItem).toHaveBeenCalledWith('key');
  });

  it('should set the item in the storage', () => {
    const storage = TestBed.inject(Storage);

    service.set('key', 'value');
    expect(storage.setItem).toHaveBeenCalledWith('key', 'value');
  });
});
