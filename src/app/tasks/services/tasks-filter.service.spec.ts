import { TestBed } from '@angular/core/testing';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { TasksFiltersService } from './tasks-filters.service';
import { TasksStatusesService } from './tasks-status.service';
import { TaskSummaryFiltersOr } from '../types';


describe('TasksFilterService', () => {
  let service: TasksFiltersService;
  const mockDefaultConfigService = {
    filters: [] as unknown as TaskSummaryFiltersOr
  };
  const mockTasksStatusesService = {
    statuses: {
      0: $localize`Unspecified`,
      3: $localize`Dispatched`,
      1: $localize`Creating`,
      2: $localize`Submitted`,
      9: $localize`Processing`,
      10: $localize`Processed`,
      7: $localize`Cancelling`,
      8: $localize`Cancelled`,
      4: $localize`Finished`,
      5: $localize`Error`,
      6: $localize`Timeout`,
      11: $localize`Retried`,
    }
  };
  const mockTableService = {
    saveFilters: jest.fn(),
    resetFilters: jest.fn(),
    restoreFilters: jest.fn(),
  };

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        TasksFiltersService,
        {provide: TasksStatusesService, useValue: mockTasksStatusesService},
        {provide: DefaultConfigService, useValue: mockDefaultConfigService }, 
        {provide: TableService, useValue: mockTableService}
        
      ]
    }).inject(TasksFiltersService);
  });

  test('should create TasksFilterService', () => {
    expect(service).toBeTruthy();
  }); 
});