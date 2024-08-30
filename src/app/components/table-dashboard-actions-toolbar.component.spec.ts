import { TestBed } from '@angular/core/testing';
import { SessionRaw, SessionRawColumnKey } from '@app/sessions/types';
import { TaskOptions } from '@app/tasks/types';
import { ColumnKey } from '@app/types/data';
import { IconsService } from '@services/icons.service';
import { TableDashboardActionsToolbarComponent } from './table-dashboard-actions-toolbar.component';

describe('TableDashboardActionsToolbarComponent', () => {
  let component: TableDashboardActionsToolbarComponent<SessionRaw, TaskOptions>;

  const loading = true;
  const refreshTooltip = 'refreshTooltip';
  const intervalValue = 10;
  const columnsLabels: Record<SessionRawColumnKey, string> = {
    'actions': 'Actions',
    'sessionId': 'Session ID',
    'status': 'Status',
  } as Record<SessionRawColumnKey, string>;
  const displayedColumns: ColumnKey<SessionRaw, TaskOptions>[] = ['sessionId', 'actions'];
  const availableColumns: ColumnKey<SessionRaw, TaskOptions>[] = ['sessionId', 'actions', 'status'];
  const lockColumns = false;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        TableDashboardActionsToolbarComponent,
        IconsService
      ]
    }).inject(TableDashboardActionsToolbarComponent<SessionRaw, TaskOptions>);
    component.loading = loading;
    component.refreshTooltip = refreshTooltip;
    component.intervalValue = intervalValue;
    component.columnsLabels = columnsLabels;
    component.displayedColumns = displayedColumns;
    component.availableColumns = availableColumns;
    component.lockColumns = lockColumns;
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should get icon', () => {
    expect(component.getIcon('refresh')).toEqual('refresh');
  });

  it('should emit refresh', () => {
    const spy = jest.spyOn(component.refresh, 'emit');
    component.onRefresh();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit interval value change', () => {
    const spy = jest.spyOn(component.intervalValueChange, 'emit');
    const value = 20;
    component.onIntervalValueChange(value);
    expect(spy).toHaveBeenCalledWith(value);
  });

  it('should emit columns change', () => {
    const spy = jest.spyOn(component.displayedColumnsChange, 'emit');
    const columns = ['actions', 'sessionId'] as ColumnKey<SessionRaw, TaskOptions>[];
    component.onColumnsChange(columns);
    expect(spy).toHaveBeenCalledWith(columns);
  });

  it('should emit columns reset', () => {
    const spy = jest.spyOn(component.resetColumns, 'emit');
    component.onColumnsReset();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit filters reset', () => {
    const spy = jest.spyOn(component.resetFilters, 'emit');
    component.onFiltersReset();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit lock columns change', () => {
    const spy = jest.spyOn(component.lockColumnsChange, 'emit');
    component.onLockColumnsChange();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit edit name line', () => {
    const spy = jest.spyOn(component.editNameLine, 'emit');
    component.onEditNameLine();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit delete line', () => {
    const spy = jest.spyOn(component.deleteLine, 'emit');
    component.onDeleteLine();
    expect(spy).toHaveBeenCalled();
  });
});