import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { AddLineDialogResult, ReorganizeLinesDialogResult, SplitLinesDialogResult } from '@app/types/dialog';
import { IconsService } from '@services/icons.service';
import { ShareUrlService } from '@services/share-url.service';
import { Observable, of } from 'rxjs';
import { IndexComponent } from './index.component';
import { DashboardIndexService } from './services/dashboard-index.service';
import { CountLine, Line, LineType } from './types';

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
    } as CountLine,
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
    } as CountLine
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

  it('should get icons', () => {
    expect(component.getIcon('heart')).toEqual('favorite');
  });

  it('should open Fab', () => {
    component.openFab();
    expect(component.showFabActions).toBeTruthy();
  });

  describe('onAddLineDialog', () => {
    it('should add a line', () => {
      dialogRef$ = of({name: 'New line', type: 'CountStatus'} as Line);
      const newLines = structuredClone(defaultLines);
      newLines.push({
        name: 'New line',
        type: 'CountStatus',
        interval: 5,
        hideGroupsHeader: false,
        filters: [],
        groups: [],
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
      } as CountLine);
      component.onAddLineDialog();
      expect(component.lines).toEqual(newLines);
    });

    it('should not add a line if there is no result', () => {
      dialogRef$ = of(undefined);
      component.onAddLineDialog();
      expect(component.lines).toEqual(defaultLines);
    });

    it('should add a line with provided values', () => {
      const result: AddLineDialogResult = {name: 'Tasks', type: 'Tasks'};
      dialogRef$ = of(result);
      const newLines = structuredClone(defaultLines);
      newLines.push({
        name: result.name,
        type: result.type,
        interval: 5,
        filters: []
      });
      component.onAddLineDialog();
      expect(component.lines).toEqual(newLines);
    });

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

  describe('getLineIcon', () => {
    it('should get Tasks Icon', () => {
      expect(component.getLineIcon('Tasks')).toEqual('adjust');
    });

    it('should get CountStatus Icon', () => {
      expect(component.getLineIcon('CountStatus')).toEqual('wifi_tethering');
    });

    it('should get Applications Icon', () => {
      expect(component.getLineIcon('Applications')).toEqual('apps');
    });

    it('should get Partitions Icon', () => {
      expect(component.getLineIcon('Partitions')).toEqual('donut_small');
    });

    it('should get Sessions Icon', () => {
      expect(component.getLineIcon('Sessions')).toEqual('workspaces');
    });

    it('should get Results Icon', () => {
      expect(component.getLineIcon('Results')).toEqual('workspace_premium');
    });

    it('should get default icon', () => {
      expect(component.getLineIcon('Unknown' as LineType)).toEqual('radio_button_unchecked');
    });
  });
});