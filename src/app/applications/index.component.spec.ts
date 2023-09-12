import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
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

  const setup = (
    tasksByStatusService: unknown,
    notificationService: unknown,
    dialog: unknown,
    iconsService: unknown,
    filtersService: unknown,
    applicationsFiltersService: unknown,
    shareURLService: unknown,
    applicationsIndexService: unknown,
    applicationsGrpcService: unknown,
    autoRefreshService: unknown
  ) => TestBed.configureTestingModule({
    imports: [IndexComponent],
    providers: [
      IndexComponent,
      {provide: TasksByStatusService, useValue: tasksByStatusService },
      {provide: NotificationService, useValue: notificationService },
      {provide: MatDialog, useValue: dialog },
      {provide: IconsService, useValue: iconsService },
      {provide: FiltersService, useValue: filtersService },
      {provide: DATA_FILTERS_SERVICE, useValue: applicationsFiltersService },
      {provide: ShareUrlService, useValue: shareURLService },
      {provide: ApplicationsIndexService, useValue: applicationsIndexService },
      {provide: ApplicationsGrpcService, useValue: applicationsGrpcService },
      {provide: AutoRefreshService, useValue: autoRefreshService },
    ]
  }).inject(IndexComponent);


  it('Should run', () => {
    const r = setup({}, {}, {}, {}, {}, {}, {}, {}, {}, {
      createInterval: jest.fn()
    });
    console.log(r);
    expect(r).toBeTruthy();
  });
});