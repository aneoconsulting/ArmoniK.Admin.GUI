import { ListOptions } from '@app/types/options';
import { QueryParamsService } from '@services/query-params.service';

describe('QueryParamsService', () => {
  let service: QueryParamsService<Record<string, string>>;

  beforeEach(() => {
    service = new QueryParamsService
    ();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create options', () => {
    const options: ListOptions<Record<string, string>> = {
      pageIndex: 1,
      pageSize: 10,
      sort: {
        active: 'name',
        direction: 'asc',
      },
    };

    const queryParamsOptions = service.createOptions(options);

    expect(queryParamsOptions).toEqual({
      pageIndex: '1',
      pageSize: '10',
      sortField: 'name',
      sortDirection: 'asc',
    });
  });
});
