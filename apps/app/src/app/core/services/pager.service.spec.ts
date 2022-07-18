import { TestBed } from '@angular/core/testing';
import { PagerService } from './pager.service';

describe('PagerService', () => {
  let service: PagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PagerService],
    });
    service = TestBed.inject(PagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should use defaultNextPage', () => {
    const params = service.createHttpParams({});

    expect(params.get('page')).toEqual('1');
  });

  it('should use defaultLimit', () => {
    const params = service.createHttpParams({});

    expect(params.get('limit')).toEqual('10');
  });

  it('should use state page and limit', () => {
    const params = service.createHttpParams({
      page: {
        current: 2,
        size: 20,
      },
    });

    expect(params.get('page')).toEqual('2');
    expect(params.get('limit')).toEqual('20');
  });

  it('should use state sort', () => {
    const params = service.createHttpParams({
      sort: {
        by: 'name',
        reverse: true,
      },
    });

    expect(params.get('orderBy')).toEqual('name');
    expect(params.get('order')).toEqual('-1');
  });

  it('should use state sort only if by is defined', () => {
    const params = service.createHttpParams({});

    expect(params.get('sort')).toEqual(null);
  });

  it('should use state filters', () => {
    const params = service.createHttpParams({
      filters: [
        {
          property: 'name',
          value: 'test',
        },
      ],
    });

    expect(params.get('name')).toEqual('test');
  });
});
