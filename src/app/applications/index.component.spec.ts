import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { DataFilterService } from '@app/types/filter-definition';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { IndexComponent } from './index.component';
import { ApplicationsGrpcService } from './services/applications-grpc.service';
import { ApplicationsIndexService } from './services/applications-index.service';

describe('Application component', () => {

  let component: IndexComponent;

  const mockApplicationIndexService = {
    availableColumsn: [],
    restoreColumns: jest.fn(),
    saveColumns: jest.fn(),
    resetColumns: jest.fn(),
    restoreOptions: jest.fn(),
    restoreIntervalValue: jest.fn(),
    saveIntervalValue: jest.fn(),
    saveOptions: jest.fn(),
    columnToLabel: jest.fn(),
    isActionsColumn: jest.fn(),
    isCountColumn: jest.fn(),
    isSimpleColumn: jest.fn(),
    isNotSortableColumn: jest.fn()
  };

  const mockShareUrlService = {
    generateSharableUrl: jest.fn()
  };

  const mockApplicationsFilterService = {
    restoreFilters: jest.fn()
  };

  const mockTasksByStatusService = {
    restoreStatuses: jest.fn(),
    saveStatuses: jest.fn()
  };

  const mockNotificationService = {
    error: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        IndexComponent,
        {provide: TasksByStatusService, useValue: mockTasksByStatusService },
        {provide: NotificationService, useValue: mockNotificationService },
        {provide: MatDialog, useValue: {} },
        IconsService,
        FiltersService,
        DataFilterService,
        { provide: DATA_FILTERS_SERVICE, useValue: mockApplicationsFilterService },
        { provide: ShareUrlService, useValue: mockShareUrlService },
        { provide: ApplicationsIndexService, useValue: mockApplicationIndexService },
        { provide: ApplicationsGrpcService, useValue: {} },
        { provide: AutoRefreshService, useValue: {
          createInterval: jest.fn()
        } },
      ]
    }).inject(IndexComponent);
  });
  
  it('Should run', () => {
    expect(component).toBeTruthy();
  });
});