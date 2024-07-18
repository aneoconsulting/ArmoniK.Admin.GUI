import { SessionStatus } from '@aneoconsultingfr/armonik.api.angular';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SessionRaw, SessionRawColumnKey, SessionRawListOptions } from '@app/sessions/types';
import { TableColumn } from '@app/types/column.type';
import { SessionData } from '@app/types/data';
import { TableComponent } from './table.component';

describe('TableComponent', () => {
  const component = new TableComponent<SessionRawColumnKey, SessionRaw, SessionData, SessionStatus>();

  const columns: TableColumn<SessionRawColumnKey>[] = [
    {
      key: 'sessionId',
      name: 'Session ID',
      sortable: true,
    },
    {
      key: 'count',
      name: 'count',
      sortable: false,
    },
    {
      key: 'actions',
      name: 'Actions',
      sortable: false,
    }
  ];

  const data: SessionData[] = [
    {
      raw: {
        sessionId: 'session-1',
      } as unknown as SessionRaw,
      filters: [],
      queryTasksParams: {},
      resultsQueryParams: {}
    },
    {
      raw: {
        sessionId: 'session-2',
      } as unknown as SessionRaw,
      filters: [],
      queryTasksParams: {},
      resultsQueryParams: {}
    }
  ];

  const options: SessionRawListOptions = {
    pageIndex: 1,
    pageSize: 10,
    sort: {
      active: 'sessionId',
      direction: 'asc',
    }
  };

  const total = 1;

  const sort: MatSort = {
    active: 'namespace',
    direction: 'asc',
    sortChange: new EventEmitter()
  } as unknown as MatSort;

  const paginator: MatPaginator = {
    pageIndex: 2,
    pageSize: 50,
    page: new EventEmitter()
  } as unknown as MatPaginator;

  const sessionComparator = (a: SessionRaw, b: SessionRaw) => {
    return a.sessionId === b.sessionId;
  };

  beforeEach(() => {
    component.columns = structuredClone(columns);
    component.dataComparator = sessionComparator;
    component.data = data;
    component.total = total;
    component.options = options;
    component.sort = sort;
    component.paginator = paginator;
    component.selection.clear();
    component.ngAfterViewInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set columnsKeys', () => {
    expect(component.columnsKeys).toEqual(columns.map((entry) => entry.key));
  });

  describe('sortChange', () => {
    it('should change sort', () => {
      sort.active = 'status';
      sort.direction = 'desc';
      component.sort.sortChange.emit();
      expect(component.options).toEqual({
        pageIndex: 0,
        pageSize: 10,
        sort: {
          active: 'status',
          direction: 'desc',
        }
      });
    });

    it('should emit optionsChange', () => {
      const spy = jest.spyOn(component.optionsChange, 'emit');
      component.sort.sortChange.emit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('paginator', () => {
    it('should change pageIndex', () => {
      paginator.pageIndex = 3;
      paginator.pageSize = 25;
      component.paginator.page.emit();
      expect(component.options).toEqual({
        pageIndex: 3,
        pageSize: 25,
        sort: {
          active: 'status',
          direction: 'desc',
        }
      });
    });

    it('should emit optionsChange', () => {
      const spy = jest.spyOn(component.optionsChange, 'emit');
      component.paginator.page.emit();
      expect(spy).toHaveBeenCalled();
    });

    it('should slice data if pageSize is lower', () => {
      paginator.pageSize = 1;
      component.paginator.page.emit();
      expect(component.data).toEqual([data[0]]);
    });
  });

  test('emitSelectionChange should emit', () => {
    const spy = jest.spyOn(component.selectionChange, 'emit');
    component.emitSelectionChange();
    expect(spy).toHaveBeenCalledWith(component.selection.selected);
  });

  test('onDrop should emit columnDrop', () => {
    const spy = jest.spyOn(component.columnDrop, 'emit');
    component.onDrop({ previousIndex: 0, currentIndex: 1 } as CdkDragDrop<string[], string[]>);
    expect(spy).toHaveBeenCalledWith(['count', 'sessionId', 'actions']);
  });

  test('onDrop should change columns order', () => {
    component.onDrop({ previousIndex: 0, currentIndex: 1 } as CdkDragDrop<string[], string[]>);
    expect(component.columns).toEqual([
      {
        key: 'count',
        name: 'count',
        sortable: false,
      },
      {
        key: 'sessionId',
        name: 'Session ID',
        sortable: true,
      },
      {
        key: 'actions',
        name: 'Actions',
        sortable: false,
      },
    ]);
  });

  test('isAllSelected should be false when not everything is selected', () => {
    component.selection.selected.push(data[0].raw);
    expect(component.isAllSelected).toBeFalsy();
  });

  describe('isSelected', () => {
    it('should return true if the row is selected', () => {
      component.selection.select(data[0].raw);
      expect(component.isSelected(data[0].raw)).toBeTruthy();
    });

    it('should return false if the row is not selected', () => {
      expect(component.isSelected(data[1].raw)).toBeFalsy();
    });

    it('should return false if there is no dataComparator', () => {
      component.dataComparator = undefined;
      component.selection.select(data[0].raw);
      expect(component.isSelected(data[0].raw)).toBeFalsy();
    });
  });

  describe('toggleAllRows', () => {
    it('should toggle all row to selected', () => {
      const spy = jest.spyOn(component.selection, 'select');
      component.toggleAllRows();
      expect(spy).toHaveBeenCalledWith(...data.map(data => data.raw));
    });

    it('should clear all row', () => {
      const spy = jest.spyOn(component.selection, 'clear');
      component.selection.selected.push(...data.map(d => d.raw));
      component.toggleAllRows();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('toggleRow', () => {
    it('should select row if it is not selected', () => {
      component.toggleRow(data[0].raw);
      expect(component.selection.isSelected(data[0].raw)).toBeTruthy();
    });

    it('should deselect row if it is selected', () => {
      component.selection.select(data[0].raw);
      component.toggleRow(data[0].raw);
      expect(component.selection.isSelected(data[0].raw)).toBeFalsy();
    });
  });

  it('should emit on PersonnalizeTasksByStatus', () => {
    const spy = jest.spyOn(component.personnalizeTasksByStatus, 'emit');
    component.onPersonnalizeTasksByStatus();
    expect(spy).toHaveBeenCalled();
  });

  it('should track by index', () => {
    const index = 0;
    expect(component.trackBy(index, data[0])).toEqual(index);
  });

  it('should unsubscribe on destroy', () => {
    const sortSpy = jest.spyOn(component.sort.sortChange, 'unsubscribe');
    const paginatorSpy = jest.spyOn(component.paginator.page, 'unsubscribe');
    component.ngOnDestroy();
    expect(sortSpy).toHaveBeenCalled();
    expect(paginatorSpy).toHaveBeenCalled();
  });
});