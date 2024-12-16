import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { TableColumn } from '@app/types/column.type';
import { ColumnKey, ResultData } from '@app/types/data';
import { NotificationService } from '@services/notification.service';
import { ResultsTableComponent } from './table.component';
import ResultsDataService from '../services/results-data.service';
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
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ResultsTableComponent,
        ResultsStatusesService,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Clipboard, useValue: mockClipBoard },
        { provide: ResultsDataService, useValue: mockResultsDataService }
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

  it('should track a result by its id', () => {
    const result = {raw: { resultId: 'result' }} as ResultData;
    expect(component.trackBy(0, result)).toEqual(result.raw.resultId);
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
});