import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { TaskStatusColored } from '@app/types/dialog';
import { IconsService } from '@services/icons.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { ApplicationTableComponent } from './table.component';
import { ApplicationsIndexService } from '../services/applications-index.service';

describe('ApplicationTableComponent', () => {
  let component: ApplicationTableComponent;

  const mockApplicationIndexService = {
    availableColumns: ['name', 'namespace', 'service', 'version', 'actions', 'count'],
    columnsLabels: {
      name: $localize`Name`,
      namespace: $localize`Namespace`,
      service: $localize`Service`,
      version: $localize`Version`,
      count: $localize`Tasks by Status`,
      actions: $localize`Actions`,
    },
    restoreColumns: jest.fn(),
    saveColumns: jest.fn(),
    resetColumns: jest.fn(),
    columnToLabel: jest.fn(),
    isActionsColumn: jest.fn(),
    isCountColumn: jest.fn(),
    isSimpleColumn: jest.fn(),
    isNotSortableColumn: jest.fn(),
    restoreOptions: jest.fn(),
    restoreIntervalValue: jest.fn(),
    saveIntervalValue: jest.fn(),
    saveOptions: jest.fn(),
    saveLockColumns: jest.fn(),
    restoreLockColumns: jest.fn()
  };

  const mockTasksByStatusService = {
    restoreStatuses: jest.fn(),
    saveStatuses: jest.fn()
  };

  let dialogSubject: BehaviorSubject<TaskStatusColored[] | undefined>;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ApplicationTableComponent,
        { provide: ApplicationsIndexService, useValue: mockApplicationIndexService },
        {provide: TasksByStatusService, useValue: mockTasksByStatusService },
        {provide: MatDialog, useValue:
          {
            open: () => {
              return {
                afterClosed: () => {
                  return dialogSubject;
                }
              };
            }
          }
        },
        IconsService
      ]
    }).inject(ApplicationTableComponent);

    component.displayedColumns = ['name', 'namespace', 'service', 'version', 'actions', 'count'];
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should return the label of a column', () => {
    component.columnToLabel('name');
    expect(mockApplicationIndexService.columnToLabel).toHaveBeenCalledWith('name');
  });

  it('should check if a column is an action', () => {
    component.isActionsColumn('actions');
    expect(mockApplicationIndexService.isActionsColumn).toHaveBeenCalledWith('actions');
  });

  it('should check if a column is a count column', () => {
    component.isCountColumn('count');
    expect(mockApplicationIndexService.isCountColumn).toHaveBeenCalledWith('count');
  });

  it('should check if a column is a simple column', () => {
    component.isSimpleColumn('name');
    expect(mockApplicationIndexService.isSimpleColumn).toHaveBeenCalledWith('name');
  });

  it('should check if a column is a sortable column', () => {
    component.isNotSortableColumn('actions');
    expect(mockApplicationIndexService.isNotSortableColumn).toHaveBeenCalledWith('actions');
  });

  it('should get required icons', () => {
    expect(component.getIcon('tune')).toEqual('tune');
    expect(component.getIcon('more')).toEqual('more_vert');
    expect(component.getIcon('view')).toEqual('visibility');
  });

  it('should change column order', () => {
    const event = {
      previousIndex: 0,
      currentIndex: 1
    } as unknown as CdkDragDrop<string[]>;
    component.onDrop(event);
    expect(mockApplicationIndexService.saveColumns).toHaveBeenCalledWith(component.displayedColumns);
    expect(component.displayedColumns).toEqual(['namespace', 'name', 'service', 'version', 'actions', 'count']);
  });

  it('should count tasks by status of the filters', () => {
    expect(component.countTasksByStatusFilters('unified_api', '1.0.0'))
      .toEqual([[
        {
          for: 'options',
          field: 5,
          value: 'unified_api',
          operator: 0
        },
        {
          for: 'options',
          field: 6,
          value: '1.0.0',
          operator: 0
        }
      ]]);
  });

  it('should create the query params of the tasks by status', () => {
    expect(component.createTasksByStatusQueryParams('name', 'version'))
      .toEqual({
        ['0-options-5-0']: 'name',
        ['0-options-6-0']: 'version'
      });
  });

  it('should create the query params to view sessions', () => {
    expect(component.createViewSessionsQueryParams('name', 'version'))
      .toEqual({
        ['0-options-5-0']: 'name',
        ['0-options-6-0']: 'version'
      });
  });

  it('should permit to personalize tasks by status', () => {
    dialogSubject = new BehaviorSubject<TaskStatusColored[] | undefined>([{
      color: 'green',
      status: TaskStatus.TASK_STATUS_COMPLETED
    }]);
    component.personalizeTasksByStatus();
    expect(component.tasksStatusesColored).toEqual([{
      color: 'green',
      status: TaskStatus.TASK_STATUS_COMPLETED
    }]);
    expect(mockTasksByStatusService.saveStatuses).toHaveBeenCalled();
  });

  it('should not personalize if there is no result', () => {
    dialogSubject = new BehaviorSubject<TaskStatusColored[] | undefined>(undefined);
    component.personalizeTasksByStatus();
    expect(mockTasksByStatusService.saveStatuses).toHaveBeenCalledTimes(0);
  });
});