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

  let component: IndexComponent;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        IndexComponent,
        {provide: TasksByStatusService, useValue: {} },
        {provide: NotificationService, useValue: {} },
        {provide: MatDialog, useValue: {} },
        {provide: IconsService, useValue: {} },
        {provide: FiltersService, useValue: {} },
        {provide: DATA_FILTERS_SERVICE, useValue: {} },
        {provide: ShareUrlService, useValue: {} },
        {provide: ApplicationsIndexService, useValue: {} },
        {provide: ApplicationsGrpcService, useValue: {} },
        {provide: AutoRefreshService, useValue: {
          createInterval: jest.fn()
        } },
      ]
    }).inject(IndexComponent);
  });
  
  it('Should run', () => {
    expect(component).toBeTruthy();
  });
});