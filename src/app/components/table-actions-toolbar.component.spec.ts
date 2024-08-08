import { TestBed } from '@angular/core/testing';
import { SessionRaw } from '@app/sessions/types';
import { TaskOptions } from '@app/tasks/types';
import { ColumnKey } from '@app/types/data';
import { IconsService } from '@services/icons.service';
import { TableActionsToolbarComponent } from './table-actions-toolbar.component';

describe('TableActionsToolbarComponent', () => {
  let component: TableActionsToolbarComponent<SessionRaw, TaskOptions>;
  const mockIconService = {
    getIcon: jest.fn()
  };
  let spyOnEventEmitter: jest.SpyInstance;

  beforeEach(async () => {
    component = TestBed.configureTestingModule({
      providers: [
        TableActionsToolbarComponent,
        { provide: IconsService, useValue: mockIconService }
      ]
    }).inject(TableActionsToolbarComponent<SessionRaw, TaskOptions>);
  });

  it('Should run', () => {
    expect(component).toBeTruthy();
  });

  it('should get icon', () => {
    component.getIcon('someIcon');
    expect(mockIconService.getIcon).toHaveBeenCalledWith('someIcon');
  });

  test('onRefresh should emit', () => {
    spyOnEventEmitter = jest.spyOn(component.refresh, 'emit');
    component.onRefresh();
    expect(spyOnEventEmitter).toHaveBeenCalled();
  });

  test('onIntervalValueChange should emit the provided number',() => {
    spyOnEventEmitter = jest.spyOn(component.intervalValueChange, 'emit');
    component.onIntervalValueChange(1);
    expect(spyOnEventEmitter).toHaveBeenCalledWith(1);
  });

  test('onDisplayedColumnsChange should emit the provided list',() => {
    spyOnEventEmitter = jest.spyOn(component.displayedColumnsChange, 'emit');
    const columnsKeys: ColumnKey<SessionRaw, TaskOptions>[] = ['actions'];
    component.onDisplayedColumnsChange(columnsKeys);
    expect(spyOnEventEmitter).toHaveBeenCalledWith(columnsKeys);
  });

  test('onResetColumns should emit', () => {
    spyOnEventEmitter = jest.spyOn(component.resetColumns, 'emit');
    component.onResetColumns();
    expect(spyOnEventEmitter).toHaveBeenCalled();
  });

  test('onResetFilters should emit', () => {
    spyOnEventEmitter = jest.spyOn(component.resetFilters, 'emit');
    component.onResetFilters();
    expect(spyOnEventEmitter).toHaveBeenCalled();
  });

  test('onLockColumns should emit', () => {
    spyOnEventEmitter = jest.spyOn(component.lockColumnsChange, 'emit');
    component.onLockColumnsChange();
    expect(spyOnEventEmitter).toHaveBeenCalled();
  });
});