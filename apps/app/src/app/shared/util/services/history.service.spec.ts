import { TestBed } from '@angular/core/testing';
import { first } from 'rxjs';
import { HistoryService } from './history.service';

describe('HistoryService', () => {
  let service: HistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HistoryService,
        {
          provide: Storage,
          useValue: {
            setItem: jasmine.createSpy('setItem'),
            getItem: jasmine
              .createSpy('getItem')
              .and.returnValue(JSON.stringify(['https://www.angular.io'])),
          },
        },
      ],
    });
    service = TestBed.inject(HistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new url to the history', () => {
    const url = 'https://www.angular.io';
    service.add(url);

    service.history$.pipe(first()).subscribe((history) => {
      expect(history[0].title).toContain(url);
    });
  });

  it('should not contain the same url twice', () => {
    const url = 'https://www.angular.io';
    service.add(url);
    service.add(url);

    service.history$.pipe(first()).subscribe((history) => {
      expect(history[0].title).toEqual(url);
      expect(history.length).toEqual(1);
    });
  });

  it('should not contain more than 3 urls', () => {
    const url1 = 'https://www.angular.io'; // Must be the first because of the storage containing it
    const url2 = 'https://www.npmjs.com';
    const url3 = 'https://www.typescriptlang.org';
    const url4 = 'https://www.google.com';
    service.add(url1);
    service.add(url2);
    service.add(url3);
    service.add(url4);

    service.history$.pipe(first()).subscribe((history) => {
      expect(history.length).toEqual(3);
    });
  });

  it('should store history in local storage', () => {
    const url = 'https://www.angular.io';
    service.add(url);

    const storage = TestBed.inject(Storage);

    expect(storage.setItem).toHaveBeenCalledWith(
      'history',
      JSON.stringify([url])
    );
  });

  it('should recover history from local storage', () => {
    service.history$.pipe(first()).subscribe((history) => {
      expect(history[0].title).toEqual('https://www.angular.io');
    });
  });
});
