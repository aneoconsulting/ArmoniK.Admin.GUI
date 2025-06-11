import { MatCheckboxChange } from '@angular/material/checkbox';
import { TaskOptions, TaskRaw } from '@app/tasks/types';
import { ColumnKey } from '@app/types/data';
import { ColumnsModifyAreaComponent } from './columns-modify-area.component';

describe('ColumnsModifyAreaComponent', () => {
  const component = new ColumnsModifyAreaComponent<TaskRaw, TaskOptions>();

  const selectedColumns: ColumnKey<TaskRaw, TaskOptions>[] = ['id', 'createdBy', 'options.options.customColumn'];

  const columnsLabels = {
    'id': 'Task ID',
    'createdBy': 'Created By',
    'creationToEndDuration': 'Creation to End'
  } as Record<ColumnKey<TaskRaw, TaskOptions>, string>;

  const columns: ColumnKey<TaskRaw, TaskOptions>[] = ['id', 'options.options.customColumn', 'count', 'actions'];

  beforeEach(() => {
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

    it('should count the number of selected columns', () => {
      expect(component.count).toEqual(2); // customColumn and id
    });
  });

  describe('updateColumn', () => {
    const emitedColumn: ColumnKey<TaskRaw, TaskOptions> = 'count';
    const checkEvent = {
      checked: true
    } as MatCheckboxChange;

    it('should emit', () => {
      const spy = jest.spyOn(component.checked, 'emit');
      component.updateColumn(checkEvent, emitedColumn);
      expect(spy).toHaveBeenCalledWith({ column: emitedColumn, checked: checkEvent.checked });
    });

    it('should add one to the count if the column is checked', () => {
      component.updateColumn(checkEvent, emitedColumn);
      expect(component.count).toEqual(3);  
    });

    it('should remove one from the count if the column is unchecked', () => {
      checkEvent.checked = false;
      component.updateColumn(checkEvent, emitedColumn);
      expect(component.count).toEqual(1);
    });
  });
});