import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TableURLService } from './table-url.service';

describe('TableURLService', () => {
  
  let service: TableURLService;
  const mockActivatedRoute = {
    snapshot: {
      queryParamMap: {
        keys: ['key1', 'key2', 'key3'],
        get: jest.fn()
      }
    }
  };

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        TableURLService,
        {provide: ActivatedRoute, useValue: mockActivatedRoute}
      ]
    }).inject(TableURLService);

    mockActivatedRoute.snapshot.queryParamMap.get.mockImplementationOnce((key: 'string') => {
      const queryParamMap: Record<string, unknown> = {
        'pageIndex': 1,
        'filters': 'someData'
      };
      
      return queryParamMap[key] ?? null;
    });
  });

  it('Should create', () => {
    expect(service).toBeTruthy();
  });

  describe('getQueryParamsOptions', () => {
    it('Should return the paramsOptions', () => {
      expect(service.getQueryParamsOptions('pageIndex')).toEqual(1);
    });
    it('Should return null if the parameter is empty', () => {
      expect(service.getQueryParamsOptions('sortDirection')).toBeNull();
    });
  });

});