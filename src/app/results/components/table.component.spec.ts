import { Clipboard } from '@angular/cdk/clipboard';
import { ViewContainerRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '@app/types/column.type';
import { ColumnKey, ResultData } from '@app/types/data';
import { Group } from '@app/types/groups';
import { NotificationService } from '@services/notification.service';
import { Observable, of } from 'rxjs';
import { ResultsTableComponent } from './table.component';
import ResultsDataService from '../services/results-data.service';
import { ResultsFiltersService } from '../services/results-filters.service';
import { ResultsStatusesService } from '../services/results-statuses.service';
import { ResultRaw } from '../types';

describe('ResultsTableComponent', () => {
  let component: ResultsTableComponent;

  const displayedColumns: TableColumn<ResultRaw>[] = [
    {
      name: 'Result ID',
      key: 'resultId',
      type: 'link',
      sortable: true,
      link: '/tasks',
    },
    {
      name: 'Status',
      key: 'status',
      type: 'status',
      sortable: true,
    },
    {
      name: 'Created at',
      key: 'createdAt',
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

  const mockResultsDataService = {
    data: [],
    total: 0,
    loading: false,
    options: {},
    filters: [],
    refresh$: {
      next: jest.fn()
    },
    refreshGroup: jest.fn(),
    groupsConditions: [],
    manageGroupDialogResult: jest.fn(),
  };

  const afterClosedMocked = jest.fn((): Observable<unknown> => of());
  const mockMatDialog = {
    open: jest.fn(() => {
      return {
        afterClosed: afterClosedMocked,
      };
    })
  };

  const mockResultsFilterService = {
    saveGroups: jest.fn(),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ResultsTableComponent,
        ResultsStatusesService,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Clipboard, useValue: mockClipBoard },
        { provide: ResultsDataService, useValue: mockResultsDataService },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: ViewContainerRef, useValue: {} },
        { provide: ResultsFiltersService, useValue: mockResultsFilterService },
      ]
    }).inject(ResultsTableComponent);

    component.displayedColumns = displayedColumns;
    component.ngOnInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('options changes', () => {
    it('should refresh data', () => {
      const spy = jest.spyOn(component.optionsUpdate, 'emit');
      component.onOptionsChange();
      expect(spy).toHaveBeenCalled();
    });
  });

  test('onDrop should call ResultsIndexService', () => {
    const newColumns: ColumnKey<ResultRaw>[] = ['actions', 'resultId', 'status'];
    const spy = jest.spyOn(component.columnUpdate, 'emit');
    component.onDrop(newColumns);
    expect(spy).toHaveBeenCalledWith(newColumns);
  });

  describe('isDataRawEqual', () => {
    it('should return true if two resultRaws are the same', () => {
      const result1 = { resultId: 'result' } as ResultRaw;
      const result2 = {...result1} as ResultRaw;
      expect(component.isDataRawEqual(result1, result2)).toBeTruthy();
    });

    it('should return false if two resultRaws are differents', () => {
      const result1 = { resultId: 'result' } as ResultRaw;
      const result2 = { resultId: 'result1' } as ResultRaw;
      expect(component.isDataRawEqual(result1, result2)).toBeFalsy();
    });
  });

  describe('track By', () => {
    it('should track a result by its id', () => {
      const result = {raw: { resultId: 'result' }} as ResultData;
      expect(component.trackBy(0, result)).toEqual(result.raw.resultId);
    });
    
    it('should track group by its name', () => {
      const group = { name: signal('some-name') } as unknown as Group<ResultRaw>;
      expect(component.trackBy(0, group)).toEqual(group.name());
    });
  });

  it('should get data', () => {
    expect(component.data).toEqual(mockResultsDataService.data);
  });

  it('should get total', () => {
    expect(component.total).toEqual(mockResultsDataService.total);
  });

  it('should get options', () => {
    expect(component.options).toEqual(mockResultsDataService.options);
  });

  it('should get filters', () => {
    expect(component.filters).toEqual(mockResultsDataService.filters);
  });

  it('should get column keys', () => {
    expect(component.columnKeys).toEqual(displayedColumns.map(c => c.key));
  });

  it('should get displayedColumns', () => {
    expect(component.columns).toEqual(displayedColumns);
  });

  describe('UpdateGroupPage', () => {
    const groupName = 'group 1';
    
    beforeEach(() => {
      component.updateGroupPage(groupName);
    });
    
    it('should refresh the selected group', () => {
      expect(mockResultsDataService.refreshGroup).toHaveBeenCalledWith(groupName);
    });
  });

  describe('openGroupSettings', () => {
    const groupName = 'Group 1';
    const result = [{name: 'Renamed Group', conditions: []}];
    
    beforeEach(() => {
      afterClosedMocked.mockReturnValueOnce(of(result));
      component.openGroupSettings(groupName);
    });
    
    it('should manage the group dialog result', () => {
      expect(mockResultsDataService.manageGroupDialogResult).toHaveBeenCalledWith(result);
    });

    it('should update the groups in the local storage', () => {
      expect(mockResultsFilterService.saveGroups).toHaveBeenCalledWith(mockResultsDataService.groupsConditions);
    });
  });
});