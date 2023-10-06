import { ApplicationRaw } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { QueryParamsService } from './query-params.service';
import { ShareUrlService } from './share-url.service';

describe('Share Url service', () => {

  let service: ShareUrlService;
  const urlRoot = 'originpathname';

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        ShareUrlService,
        { provide: Window, useValue: {
          location: {
            origin: 'origin',
            pathname: 'pathname'
          }
        } },
        QueryParamsService
      ]
    }).inject(ShareUrlService);
  });

  it('should run', () => {
    expect(service).toBeTruthy();
  });

  describe('generateSharableURL', () => {
    it('Should return a url without any parameters when none are provided', () => {
      expect(service.generateSharableURL(null, null)).toBe(`${urlRoot}`);
    });
    describe('with optionals parameters when they are provided', () => {
      it('when field is ascending', () => {
        const options: ListOptions<ApplicationRaw> = {
          pageIndex: 1,
          pageSize: 10,
          sort: {
            active: ['name','service'] as unknown as keyof ApplicationRaw,
            direction: 'asc'
          }
        };
        const optionsResult = 'pageIndex=1&pageSize=10&sortField=name,service&sortDirection=asc';
        expect(service.generateSharableURL(options, null))
          .toBe(`${urlRoot}?${optionsResult}`);
      });
      it('when field is descending', () => {
        const options: ListOptions<ApplicationRaw> = {
          pageIndex: 1,
          pageSize: 10,
          sort: {
            active: ['name','service'] as unknown as keyof ApplicationRaw,
            direction: 'desc'
          }
        };
        const optionsResult = 'pageIndex=1&pageSize=10&sortField=name,service&sortDirection=desc';
        expect(service.generateSharableURL(options, null))
          .toBe(`${urlRoot}?${optionsResult}`);
      });
      it('when there is only one field', () => {
        const options: ListOptions<ApplicationRaw> = {
          pageIndex: 1,
          pageSize: 10,
          sort: {
            active: ['service'] as unknown as keyof ApplicationRaw,
            direction: 'desc'
          }
        };
        const optionsResult = 'pageIndex=1&pageSize=10&sortField=service&sortDirection=desc';
        expect(service.generateSharableURL(options, null))
          .toBe(`${urlRoot}?${optionsResult}`);
      });
      it('when there is no field', () => {
        const options: ListOptions<ApplicationRaw> = {
          pageIndex: 1,
          pageSize: 10,
          sort: {
            active: [] as unknown as keyof ApplicationRaw,
            direction: 'desc'
          }
        };
        const optionsResult = 'pageIndex=1&pageSize=10&sortDirection=desc';
        expect(service.generateSharableURL(options, null))
          .toBe(`${urlRoot}?${optionsResult}`);
      });
    });
    describe('with filters parameters when they are provided', () => {
      it('when only one filter is provided', () => {
        const filters: FiltersOr<number, number> = [[{
          for: 'root',
          field: 2,
          value: 'filterValue',
          operator: 1
        }]];
        const filterResult = '0-root-2-1=filterValue';
        expect(service.generateSharableURL(null, filters))
          .toBe(`${urlRoot}?${filterResult}`);
      });
      it('when two Filters are provided', () => {
        const filters: FiltersOr<number, number> = [[
          {
            for: 'root',
            field: 2,
            value: 'filterValue',
            operator: 1
          },
          {
            for: 'options',
            field: 4,
            value: 42,
            operator: 3
          }
        ]];
        const filterResult = '0-root-2-1=filterValue&0-options-4-3=42';
        expect(service.generateSharableURL(null, filters))
          .toBe(`${urlRoot}?${filterResult}`);
      });
      it('when two FiltersAND are provided', () => {
        const filters: FiltersOr<number, number> = [
          [{
            for: 'root',
            field: 2,
            value: 'filterValue',
            operator: 1
          }],
          [{
            for: 'options',
            field: 4,
            value: 42,
            operator: 3
          }]
        ];
        const filterResult = '0-root-2-1=filterValue&1-options-4-3=42';
        expect(service.generateSharableURL(null, filters))
          .toBe(`${urlRoot}?${filterResult}`);
      });
      it('When four Filters in two FiltersAND are provided', () => {
        const filters: FiltersOr<number, number> = [
          [{
            for: 'root',
            field: 2,
            value: 'filterValue',
            operator: 1
          },
          {
            for: 'root',
            field: 1,
            value: 1,
            operator: 0
          }],
          [{
            for: 'options',
            field: 4,
            value: 42,
            operator: 3
          },
          {
            for: 'root',
            field: 3,
            value: 'myField',
            operator: 2
          }]
        ];
        const filterResult1 = '0-root-2-1=filterValue&0-root-1-0=1';
        const filterResult2 = '1-options-4-3=42&1-root-3-2=myField';
        expect(service.generateSharableURL(null, filters))
          .toBe(`${urlRoot}?${filterResult1}&${filterResult2}`);
      });
    });
    it('with optionals and filters parameters when they are both provided', () => {
      const options: ListOptions<ApplicationRaw> = {
        pageIndex: 1,
        pageSize: 10,
        sort: {
          active: [] as unknown as keyof ApplicationRaw,
          direction: 'desc'
        }
      };
      const filters: FiltersOr<number, number> = [[{
        for: 'root',
        field: 2,
        value: 'filterValue',
        operator: 1
      }]];
      const optionsResult = 'pageIndex=1&pageSize=10&sortDirection=desc';
      const filterResult = '0-root-2-1=filterValue';
      expect(service.generateSharableURL(options, filters))
        .toBe(`${urlRoot}?${optionsResult}&${filterResult}`);
    });
  });
});