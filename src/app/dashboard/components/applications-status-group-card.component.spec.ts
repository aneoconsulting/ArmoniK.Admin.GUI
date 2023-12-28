import { FilterStringOperator, TaskOptionEnumField, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ApplicationRawFilter } from '@app/applications/types';
import { TaskStatusColored } from '@app/types/dialog';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { ApplicationStatusGroupCardComponent } from './applications-status-group-card.component';

describe('ApplicationStatusGroupCardComponent', () => {
  let component: ApplicationStatusGroupCardComponent;

  const taskStatusColored: TaskStatusColored[] = [
    {color: 'green', status: TaskStatus.TASK_STATUS_CREATING},
    {color: 'red', status: TaskStatus.TASK_STATUS_CANCELLED}
  ];
  const mockMatDialog = {
    open: jest.fn(() => {
      return {
        afterClosed() {
          return of(taskStatusColored);
        }
      };
    }),
  };

  const mockTasksByStatusService = {
    restoreStatuses: jest.fn(),
    saveStatuses: jest.fn()
  };

  const filters: ApplicationRawFilter = [
    [
      {
        field: 1,
        for: 'root',
        operator: 1,
        value: 2
      },
      {
        field: 2,
        for: 'root',
        operator: 2,
        value: 'string'
      },
      {
        field: 1,
        for: 'root',
        operator: 0, // This shouldn't appear as a filter when redirecting on a task since it is the application name
        value: 2
      },
    ],
    [
      {
        field: 1,
        for: 'root',
        operator: 3,
        value: 'someValue'
      }
    ]
  ];

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ApplicationStatusGroupCardComponent,
        { provide: MatDialog, useValue: mockMatDialog },
        IconsService,
        FiltersService,
        { provide: TasksByStatusService, useValue: mockTasksByStatusService },
      ]
    }).inject(ApplicationStatusGroupCardComponent);

    component.data = [
      {
        name: 'Application 1',
        namespace: 'Application namespace 1',
        service: 'Service 1',
        version: '1.0.0'
      },
      {
        name: 'Application 2',
        namespace: 'Application namespace 2',
        service: 'Service 2',
        version: '1.0.5'
      }
    ];

    component.filters = [];
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    component.ngOnInit();
    expect(mockTasksByStatusService.restoreStatuses).toHaveBeenCalledWith('applications');
  });

  describe('getColumnLabel', () => {
    it('should match a label for "name"', () => {
      expect(component.getColumnLabel('name')).toEqual('Application');
    });
    it('should match a label for "statuses"', () => {
      expect(component.getColumnLabel('statuses')).toEqual('Tasks by Status');
    });
    it('should have a default value', () => {
      expect(component.getColumnLabel('something')).toEqual('-');
    });
  });

  it('should get all the statuses of an application', () => {
    const applicationName = 'Application 1';
    const applicationVersion = 'Namespace 1';
    expect(component.countTasksByStatusFilters(applicationName, applicationVersion)).toEqual([[
      {
        for: 'options',
        field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME,
        value: applicationName,
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL
      },
      {
        for: 'options',
        field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION,
        value: applicationVersion,
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL
      }
    ]]);
  });

  describe('createTasksByStatusQueryParams', () => {

    const name = 'Application 1';
    const version = '1.0.0';

    it('should create query params for the specified application', () => {
      expect(component.createTasksByStatusQueryParams(name, version)).toEqual({
        '0-options-5-0': name,
        '0-options-6-0': version
      });
    });

    it('should create query params for the specified application and applied filters', () => {
      component.filters = filters;
      expect(component.createTasksByStatusQueryParams(name, version)).toEqual({
        '0-options-5-0': name,
        '0-options-6-0': version,
        '0-options-6-1': '2',
        '0-options-7-2': 'string',
        '1-options-5-0': name,
        '1-options-6-0': version,
        '1-options-6-3': 'someValue',
      });
    });
  });

  it('should get icon', () => {
    expect(component.getIcon('tune')).toEqual('tune');
  });

  describe('personalizeTasksByStatus', () => {
    it('should personnalize tasks status', () => {
      component.personalizeTasksByStatus();
      expect(component.tasksStatusesColored).toEqual(taskStatusColored);
    });

    it('should save statuses colors', () => {
      component.personalizeTasksByStatus();
      expect(mockTasksByStatusService.saveStatuses).toHaveBeenCalledWith('applications', taskStatusColored);
    });
  });
});