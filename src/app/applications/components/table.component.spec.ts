import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ManageGroupsDialogResult, TasksStatusesGroup } from '@app/dashboard/types';
import { GrpcAction } from '@app/types/actions.type';
import { TableColumn } from '@app/types/column.type';
import { ApplicationData, ColumnKey } from '@app/types/data';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { of } from 'rxjs';
import { ApplicationsTableComponent } from './table.component';
import ApplicationsDataService from '../services/applications-data.service';
import { ApplicationRaw } from '../types';

function getAction(actions: GrpcAction<ApplicationRaw>[], label: string) {
  return actions.filter(action => action.label === label)[0];
} 

describe('TasksTableComponent', () => {
  let component: ApplicationsTableComponent;

  const displayedColumns: TableColumn<ApplicationRaw>[] = [
    {
      name: 'Namespace',
      key: 'namespace',
      type: 'link',
      sortable: true,
      link: '/tasks',
    },
    {
      name: 'Namespace',
      key: 'name',
      type: 'status',
      sortable: true,
    },
    {
      name: 'version',
      key: 'version',
      type: 'date',
      sortable: true,
    },
    {
      name: 'Actions',
      key: 'actions',
      type: 'actions',
      sortable: false,
    }
  ];

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
  };

  const mockClipBoard = {
    copy: jest.fn()
  };

  const defaultStatusesGroups: TasksStatusesGroup[] = [
    {
      name: 'Completed',
      statuses: [TaskStatus.TASK_STATUS_COMPLETED],
      color: '#4caf50',
    },
    {
      name: 'Error',
      statuses: [TaskStatus.TASK_STATUS_ERROR],
      color: '#ff0000',
    },
  ];

  const mockDialogReturn: ManageGroupsDialogResult = {
    groups: [
      {
        name: 'Timeout',
        statuses: [TaskStatus.TASK_STATUS_TIMEOUT],
        color: '#ff6944',
      },
      {
        name: 'Retried',
        statuses: [TaskStatus.TASK_STATUS_RETRIED],
        color: '#ff9800',
      }
    ]
  };

  const mockMatDialog = {
    open: jest.fn(() => {
      return {
        afterClosed: jest.fn(() => of(mockDialogReturn))
      };
    })
  };

  const mockTasksByStatusService = {
    restoreStatuses: jest.fn(() => defaultStatusesGroups),
    saveStatuses: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  const mockApplicationsDataService = {
    data: [],
    total: 0,
    loading: false,
    options: {},
    filters: [],
    refresh$: {
      next: jest.fn()
    },
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ApplicationsTableComponent,
        { provide: ApplicationsDataService, useValue: mockApplicationsDataService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Clipboard, useValue: mockClipBoard },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: TasksByStatusService, useValue: mockTasksByStatusService },
        IconsService,
        { provide: Router, useValue: mockRouter }
      ]
    }).inject(ApplicationsTableComponent);

    component.displayedColumns = displayedColumns;
    component.ngOnInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('init statuses', () => {
      expect(component.statusesGroups).toEqual(defaultStatusesGroups);
    });
  });

  describe('options changes', () => {
    it('should emit', () => {
      const spy = jest.spyOn(component.optionsUpdate, 'emit');
      component.onOptionsChange();
      expect(spy).toHaveBeenCalled();
    });
  });

  test('onDrop should emit', () => {
    const spy = jest.spyOn(component.columnUpdate, 'emit');
    const newColumns: ColumnKey<ApplicationRaw>[] = ['actions', 'name', 'namespace', 'version'];
    component.onDrop(newColumns);
    expect(spy).toHaveBeenCalledWith(newColumns);
  });

  describe('personnalizeTasksByStatus', () => {
    beforeEach(() => {
      component.personalizeTasksByStatus();
    });

    it('should update statusesGroup', () => {
      expect(component.statusesGroups).toEqual(mockDialogReturn.groups);
    });

    it('should call tasksByStatus service',() => {
      expect(mockTasksByStatusService.saveStatuses).toHaveBeenCalledWith(component.table, component.statusesGroups);
    });
  });

  it('should create params for a session redirection', () => {
    const data = {
      name: 'name',
      version: 'version'
    };
    expect(component.createViewSessionsQueryParams(data.name, data.version)).toEqual({
      '0-options-5-0': data.name,
      '0-options-6-0': data.version
    });
  });

  it('should get page icon', () => {
    expect(component.getIcon('applications')).toEqual('apps');
  });

  describe('actions', () => {
    it('should redirect to sessions', () => {
      const data = {
        name: 'name',
        version: 'version'
      } as unknown as ApplicationRaw;
      const action = getAction(component.actions, 'See session');
      action.click([data]);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions'], { queryParams: component.createViewSessionsQueryParams(data.name, data.version) });
    });
  });

  describe('isDataRawEqual', () => {
    it('should return true if two ApplicationRaws are the same', () => {
      const application1 = { name: 'application', version: '0.1.2' } as ApplicationRaw;
      const application2 = {...application1} as ApplicationRaw;
      expect(component.isDataRawEqual(application1, application2)).toBeTruthy();
    });

    it('should return false if two ApplicationRaws are differents', () => {
      const application1 = { name: 'application', version: '0.1.2'} as ApplicationRaw;
      const application2 = { name: 'application', version: '0.1.3'} as ApplicationRaw;
      expect(component.isDataRawEqual(application1, application2)).toBeFalsy();
    });
  });

  it('should track an application by its name and version', () => {
    const application = {raw: { name: 'application', version: '0.1.2'}} as ApplicationData;
    expect(component.trackBy(0, application)).toEqual(`${application.raw.name}-${application.raw.version}`);
  });

  it('should get data', () => {
    expect(component.data).toEqual(mockApplicationsDataService.data);
  });

  it('should get total', () => {
    expect(component.total).toEqual(mockApplicationsDataService.total);
  });

  it('should get options', () => {
    expect(component.options).toEqual(mockApplicationsDataService.options);
  });

  it('should get filters', () => {
    expect(component.filters).toEqual(mockApplicationsDataService.filters);
  });

  it('should get column keys', () => {
    expect(component.columnKeys).toEqual(displayedColumns.map(c => c.key));
  });

  it('should get displayedColumns', () => {
    expect(component.columns).toEqual(displayedColumns);
  });
});