import { TestBed } from '@angular/core/testing';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TaskOptions, TaskRaw } from '@app/tasks/types';
import { ColumnKey } from '@app/types/data';
import { ColumnsModifyAreaComponent } from './columns-modify-area.component';

describe('ColumnsModifyAreaComponent', () => {
  let component: ColumnsModifyAreaComponent<TaskRaw, TaskOptions>;

  const selectedColumns: ColumnKey<TaskRaw, TaskOptions>[] = ['id', 'createdBy', 'options.options.customColumn'];

  const columnsLabels = {
    'id': 'Task ID',
    'createdBy': 'Created By',
    'creationToEndDuration': 'Creation to End'
  } as Record<ColumnKey<TaskRaw, TaskOptions>, string>;

  const columns: ColumnKey<TaskRaw, TaskOptions>[] = ['id', 'options.options.customColumn', 'count', 'actions'];

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ColumnsModifyAreaComponent,
      ],
    }).inject(ColumnsModifyAreaComponent<TaskRaw, TaskOptions>);
    component.selectedColumns = selectedColumns;
    component.columnsLabels = columnsLabels;
    component.columns = columns;
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should set the columns labels properly', () => {
      expect(component.columnsLabels).toEqual(columnsLabels);
    });

    it('should set the selectedColumns properly', () => {
      expect(component.selectedColumns).toEqual(selectedColumns);
    });

    it('should set the columns properly', () => {
      expect(component.allColumns).toEqual(columns);
    });

    it('should count only the selected columns that are provided to the component', () => {
      expect(component.count).toEqual(2); // customColumn and id
    });
  });

  describe('selectOne', () => {
    const emitedColumn: ColumnKey<TaskRaw, TaskOptions> = 'count';
    const checkEvent = {
      checked: true
    } as MatCheckboxChange;

    it('should emit', () => {
      const spy = jest.spyOn(component.checked, 'emit');
      component.selectOne(checkEvent, emitedColumn);
      expect(spy).toHaveBeenCalledWith({ column: emitedColumn, checked: checkEvent.checked });
    });

    it('should add one to the count if the column is checked', () => {
      component.selectOne(checkEvent, emitedColumn);
      expect(component.count).toEqual(3);  
    });

    it('should remove one from the count if the column is unchecked', () => {
      checkEvent.checked = false;
      component.selectOne(checkEvent, emitedColumn);
      expect(component.count).toEqual(1);
    });
  });

  describe('selectAllOnClick', () => {
    const checkEvent = {
      checked: true
    } as MatCheckboxChange;

    it('should emit', () => {
      const spy = jest.spyOn(component.selectAll, 'emit');
      component.selectAllOnClick(checkEvent);
      expect(spy).toHaveBeenCalledWith(checkEvent.checked);
    });

    it('should set the count to the columns length on select all', () => {
      component.count = 0;
      component.selectAllOnClick(checkEvent);
      expect(component.count).toEqual(component.allColumns.length);
    });

    it('should set the count to 0 on unselect all', () => {
      component.count = 12;
      checkEvent.checked = false;
      component.selectAllOnClick(checkEvent);
      expect(component.count).toEqual(0);
    });
  });
});