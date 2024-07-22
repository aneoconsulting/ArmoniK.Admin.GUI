import { TestBed } from '@angular/core/testing';
import { SessionRaw } from '@app/sessions/types';
import { TaskOptions } from '@app/tasks/types';
import { ColumnKey } from '@app/types/data';
import { IconsService } from '@services/icons.service';
import { TableIndexActionsToolbarComponent } from './table-index-actions-toolbar.component';

describe('TableDashboardActionsToolbarComponent', () => {
  let component: TableIndexActionsToolbarComponent<SessionRaw, TaskOptions>;

  const loading = true;
  const refreshTooltip = 'refreshTooltip';
  const intervalValue = 10;
  const columnsLabels: Record<ColumnKey<SessionRaw, TaskOptions>, string> = {
    'actions': 'Actions',
    'sessionId': 'Session ID',
    'status': 'Status',
  } as Record<ColumnKey<SessionRaw, TaskOptions>, string>;
  const displayedColumns: ColumnKey<SessionRaw, TaskOptions>[] = ['sessionId', 'actions'];
  const availableColumns: ColumnKey<SessionRaw, TaskOptions>[] = ['sessionId', 'actions', 'status'];
  const lockColumns = false;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        TableIndexActionsToolbarComponent,
        IconsService
      ]
    }).inject(TableIndexActionsToolbarComponent<SessionRaw, TaskOptions>);
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
    expect(component.getIcon('sessions')).toEqual('workspaces');
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

  it('should emit add to dashboard', () => {
    const spy = jest.spyOn(component.addToDashboard, 'emit');
    component.onAddToDashboard();
    expect(spy).toHaveBeenCalled();
  });
});