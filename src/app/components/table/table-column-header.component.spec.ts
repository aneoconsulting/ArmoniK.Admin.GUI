import { TestBed } from '@angular/core/testing';
import { SessionRaw } from '@app/sessions/types';
import { TaskOptions } from '@app/tasks/types';
import { TableColumn } from '@app/types/column.type';
import { IconsService } from '@services/icons.service';
import { TableColumnHeaderComponent } from './table-column-header.component';

describe('TableColumnHeaderComponent', () => {
  let component: TableColumnHeaderComponent<SessionRaw, TaskOptions>;

  const initColumn: TableColumn<SessionRaw, TaskOptions> = {
    type: 'count',
    key: 'count',
    name: 'Tasks by Status',
    sortable: false,
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        TableColumnHeaderComponent,
        IconsService,
      ]
    }).inject(TableColumnHeaderComponent);
    component.column = initColumn;
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly set name', () => {
    expect(component.name).toEqual(initColumn.name);
  });

  it('should correctly set icon', () => {
    expect(component.icon).toEqual(component.iconService.getIcon('tune'));
  });

  it('should correctly set type', () => {
    expect(component.type).toEqual(initColumn.type);
  });

  it('should set "raw" as the default type', () => {
    component.column = { ...initColumn, type: undefined };
    expect(component.type).toEqual('raw');
  });

  it('should emit on toggle all rows', () => {
    const spy = jest.spyOn(component.rowsSelectionChange, 'emit');
    component.onToggleAllRows();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit on personnalize tasks by status', () => {
    const spy = jest.spyOn(component.statusesChange, 'emit');
    component.onPersonnalizeStatuses();
    expect(spy).toHaveBeenCalled();
  });
});