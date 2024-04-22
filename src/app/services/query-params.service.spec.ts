import { ApplicationRaw } from '@aneoconsultingfr/armonik.api.angular';
import { IndexListOptions } from '@app/types/data';
import { FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { QueryParamsService } from './query-params.service';

describe('QueryParamsService', () => {
  
  let service: QueryParamsService;

  beforeEach(() => {
    service = new QueryParamsService;
  });

  it('Should run', () => {
    expect(service).toBeTruthy();
  });

  it('Should create options', () => {
    const options: ListOptions<ApplicationRaw> = {
      pageIndex: 1,
      pageSize: 10,
      sort: {
        active: ['name','service'] as unknown as keyof ApplicationRaw,
        direction: 'asc'
      }
    };
    const optionsResult = {
      pageIndex:'1',
      pageSize:'10',
      sortField:'name,service',
      sortDirection:'asc'
    };
    expect(service.createOptions(options as IndexListOptions)).toEqual(optionsResult);
  });

  it('Should create Filters', () => {
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
    const filtersResult = {
      '0-root-2-1': 'filterValue',
      '0-root-1-0': 1,
      '1-options-4-3': 42,
      '1-root-3-2': 'myField'
    };
    expect(service.createFilters(filters)).toEqual(filtersResult);
  });
});