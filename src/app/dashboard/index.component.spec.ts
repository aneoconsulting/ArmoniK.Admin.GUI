import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { AddLineDialogResult, ReorganizeLinesDialogResult, SplitLinesDialogResult } from '@app/types/dialog';
import { IconsService } from '@services/icons.service';
import { ShareUrlService } from '@services/share-url.service';
import { IndexComponent } from './index.component';
import { DashboardIndexService } from './services/dashboard-index.service';
import { Line } from './types';

describe('IndexComponent', () => {
  let component: IndexComponent;

  let dialogRef$: Observable<AddLineDialogResult | SplitLinesDialogResult  | ReorganizeLinesDialogResult | undefined>;

  const defaultUrl = 'https://some-url/';
  const defaultLines: Line[] = [
    {
      name: 'line1',
      type: 'Tasks',
      interval: 10,
      hideGroupsHeader: false,
      filters: [],
      taskStatusesGroups: [
        { name: 'Success', color: 'green', statuses: [TaskStatus.TASK_STATUS_COMPLETED, TaskStatus.TASK_STATUS_PROCESSED]},
        { name: 'Running', color: 'yellow', statuses: [TaskStatus.TASK_STATUS_CREATING, TaskStatus.TASK_STATUS_PROCESSING]},
        { name: 'Error', color: 'red', statuses: [TaskStatus.TASK_STATUS_CANCELLED, TaskStatus.TASK_STATUS_TIMEOUT]}
      ],
    },
    {
      name: 'line2',
      type: 'Tasks',
      interval: 20,
      hideGroupsHeader: true,
      filters: [],
      taskStatusesGroups: [
        { name: 'Success', color: 'green', statuses: [TaskStatus.TASK_STATUS_COMPLETED, TaskStatus.TASK_STATUS_PROCESSED]},
        { name: 'Running', color: 'yellow', statuses: [TaskStatus.TASK_STATUS_CREATING, TaskStatus.TASK_STATUS_PROCESSING]},
        { name: 'Unspecified', color: 'grey', statuses: [TaskStatus.TASK_STATUS_UNSPECIFIED, TaskStatus.TASK_STATUS_RETRIED]}
      ],
    }
  ];
  
  const mockMatDialog = {
    open: jest.fn(() => {
      return {
        afterClosed() {
          return dialogRef$;
        }
      };
    })
  };

  const mockShareUrlService = {
    generateSharableURL: jest.fn(() => defaultUrl)
  };

  const mockDashboardIndexService = {
    restoreLines: jest.fn(() => structuredClone(defaultLines)),
    restoreSplitLines: jest.fn(() => 10),
    saveLines: jest.fn(),
    saveSplitLines: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        IndexComponent,
        { provide: MatDialog, useValue: mockMatDialog },
        IconsService,
        { provide: ShareUrlService, useValue: mockShareUrlService },
        { provide: DashboardIndexService, useValue: mockDashboardIndexService }
      ]
    }).inject(IndexComponent);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    expect(component.lines).toEqual(defaultLines);
    expect(component.sharableURL).toEqual(defaultUrl);
    expect(component.columns).toEqual(10);
  });

  it('should get required icons', () => {
    expect(component.getIcon('settings')).toEqual('settings');
    expect(component.getIcon('add')).toEqual('add');
    expect(component.getIcon('list')).toEqual('view_list');
    expect(component.getIcon('vertical-split')).toEqual('vertical_split');
  });

  it('should get page icon', () => {
    expect(component.getPageIcon('dashboard')).toEqual('dashboard');
  });

  it('should open Fab', () => {
    component.openFab();
    expect(component.showFabActions).toBeTruthy();
  });

  it('should add a line', () => {
    dialogRef$ = of({name: 'New line', type: 'CountStatus'} as unknown as Line);
    const newLines = structuredClone(defaultLines);
    newLines.push({
      name: 'New line',
      type: 'CountStatus',
      interval: 5,
      hideGroupsHeader: false,
      filters: [],
      taskStatusesGroups: [
        {
          name: 'Finished',
          color: '#00ff00',
          statuses: [
            TaskStatus.TASK_STATUS_COMPLETED,
            TaskStatus.TASK_STATUS_CANCELLED,
          ],
        },
        {
          name: 'Running',
          color: '#ffa500',
          statuses: [
            TaskStatus.TASK_STATUS_PROCESSING,
          ]
        },
        {
          name: 'Errors',
          color: '#ff0000',
          statuses: [
            TaskStatus.TASK_STATUS_ERROR,
            TaskStatus.TASK_STATUS_TIMEOUT,
          ]
        },
      ],
    });
    component.onAddLineDialog();
    expect(component.lines).toEqual(newLines);
  });

  it('should reorganize lines', () => {
    dialogRef$ = of({lines: structuredClone(defaultLines).reverse()});
    component.onReorganizeLinesDialog();
    expect(component.lines).toEqual(structuredClone(defaultLines).reverse());
  });

  it('should split lines', () => {
    dialogRef$ = of({columns: 4});
    component.onSplitLinesDialog();
    expect(component.columns).toEqual(4);
  });

  it('should delete line', () => {
    component.onDeleteLine(component.lines[0]);
    expect(component.lines).toEqual([
      {
        name: 'line2',
        type: 'Tasks',
        interval: 20,
        hideGroupsHeader: true,
        filters: [],
        taskStatusesGroups: [
          { name: 'Success', color: 'green', statuses: [TaskStatus.TASK_STATUS_COMPLETED, TaskStatus.TASK_STATUS_PROCESSED]},
          { name: 'Running', color: 'yellow', statuses: [TaskStatus.TASK_STATUS_CREATING, TaskStatus.TASK_STATUS_PROCESSING]},
          { name: 'Unspecified', color: 'grey', statuses: [TaskStatus.TASK_STATUS_UNSPECIFIED, TaskStatus.TASK_STATUS_RETRIED]}
        ],
      }
    ]);
  });

  it('should save on change', () => {
    component.onSaveChange();
    expect(mockDashboardIndexService.saveLines).toHaveBeenCalledWith(component.lines);
  });

  it('should track by line', () => {
    expect(component.trackByLine(0, component.lines[0])).toEqual('line10');
  });
});