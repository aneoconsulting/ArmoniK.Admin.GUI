import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskOptions, TaskRaw, TaskSummary } from '@app/tasks/types';
import { TableColumn } from '@app/types/column.type';
import { ColumnKey, CustomColumn } from '@app/types/data';
import { ColumnsModifyDialogData } from '@app/types/dialog';
import { ColumnsModifyDialogComponent } from './columns-modify-dialog.component';
import { CheckedColumn } from './type';

describe('', () => {
  let component: ColumnsModifyDialogComponent<TaskSummary, TaskOptions>;

  const mockMatDialogRef = {
    close: jest.fn()
  } as unknown as MatDialogRef<ColumnsModifyDialogComponent<TaskSummary, TaskOptions>>;

  const selectedColumns: ColumnKey<TaskRaw, TaskOptions>[] = ['id', 'createdBy', 'options.options.customColumn'];

  const columnsLabels = {
    'id': 'Task ID',
    'createdBy': 'Created By',
    'creationToEndDuration': 'Creation to End'
  } as Record<ColumnKey<TaskRaw, TaskOptions>, string>;

  // 'id', 'options.options.customColumn', 'count', 'actions'
  const columns: TableColumn<TaskRaw, TaskOptions>[] = [
    {
      key: 'id',
      name: 'Task ID',
      sortable: true,
    },
    {
      key: 'createdAt',
      name: 'Created At',
      sortable: true,
      type: 'date',
    },
    {
      key: 'creationToEndDuration',
      name: 'Creation To End Duration',
      sortable: true,
      type: 'duration'
    },
    {
      key: 'options',
      name: 'Options',
      sortable: true,
      type: 'object',
    },
    {
      key: 'parentTaskIds',
      name: 'Parent Tasks',
      sortable: false,
      type: 'array',
    },
    {
      key: 'options.applicationName',
      name: 'Application Name',
      sortable: true,
    }
  ];

  const customColumns: CustomColumn[] = ['options.options.FastCompute', 'options.options.EngineReady'];

  const mockMatDialogData = {
    currentColumns: [...selectedColumns],
    columnsLabels: columnsLabels,
    availableColumns: columns,
    customColumns: customColumns
  } as ColumnsModifyDialogData<TaskSummary, TaskOptions>;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ColumnsModifyDialogComponent,
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData }
      ]
    }).inject(ColumnsModifyDialogComponent);
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should get current columns', () => {
      expect(component.selectedColumns).toEqual(selectedColumns);
    });

    it('should set the columns Labels', () => {
      expect(component.columnsLabels).toEqual(columnsLabels);
    });

    it('should group the common columns', () => {
      expect(component.commonColumns).toEqual(['id']);
    });

    it('should group the date columns', () => {
      expect(component.dateColumns).toEqual(['createdAt', 'creationToEndDuration']);
    });

    it('should group the common columns', () => {
      expect(component.objectArrayColumns).toEqual(['options', 'parentTaskIds']);
    });

    it('should group the common columns', () => {
      expect(component.optionsColumns).toEqual(['options.applicationName']);
    });

    it('should group the common columns', () => {
      expect(component.customColumns).toEqual(customColumns);
    });
  });

  describe('updateColumn', () => {
    it('should add a column on check', () => {
      const checkEvent: CheckedColumn<TaskSummary, TaskOptions> = { checked: true, column: 'endedAt' };
      component.updateColumn(checkEvent);
      expect(component.selectedColumns).toContain('endedAt');
    });

    it('should add a column on unchecked', () => {
      const checkEvent: CheckedColumn<TaskSummary, TaskOptions> = { checked: false, column: 'id' };
      component.updateColumn(checkEvent);
      expect(component.selectedColumns).not.toContain('id');
    });
  });

  it('should close on "No Click"', () => {
    component.onNoClick();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });
});