import { TestBed } from '@angular/core/testing';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskOptions, TaskSummary } from '@app/tasks/types';
import { ColumnKey, CustomColumn, PrefixedOptions } from '@app/types/data';
import { ColumnsModifyDialogData } from '@app/types/dialog';
import { ColumnsModifyDialogComponent } from './columns-modify-dialog.component';

describe('', () => {
  let component: ColumnsModifyDialogComponent<TaskSummary, TaskOptions>;

  const mockMatDialogRef = {
    close: jest.fn()
  } as unknown as MatDialogRef<ColumnsModifyDialogComponent<TaskSummary, TaskOptions>>;

  const currentColumns: ColumnKey<TaskSummary, TaskOptions>[] = ['id', 'createdAt'];
  const columnsLabels = {
    'id': 'ID',
    'createdAt': 'Creation time',
    'options.engineType': 'Engine Type',
    'options.partitionId': 'Partition Ids',
    'actions': 'Actions'
  } as Record<ColumnKey<TaskSummary, TaskOptions>, string>;
  const columns: ColumnKey<TaskSummary, TaskOptions>[] = ['id', 'createdAt', 'actions'];
  const optionsColumns: PrefixedOptions<TaskOptions>[] = ['options.engineType', 'options.partitionId'];
  const customColumns: CustomColumn[] = ['options.options.FastCompute', 'options.options.EngineReady'];

  const mockMatDialogData = {
    currentColumns: currentColumns,
    columnsLabels: columnsLabels,
    availableColumns: [...columns, ...optionsColumns, ...customColumns]
  } as ColumnsModifyDialogData<TaskSummary, TaskOptions>;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ColumnsModifyDialogComponent,
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData }
      ]
    }).inject(ColumnsModifyDialogComponent);
    component.ngOnInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should get current columns', () => {
      expect(component.columns).toEqual(mockMatDialogData.currentColumns);
    });

    it('should copy current columns', () => {
      expect(component.columns).not.toBe(mockMatDialogData.currentColumns);
    });

    it('should set and sort alphabetically the "normal" columns', () => {
      expect(component.availableColumns).toEqual(columns.sort((a: string, b: string) => a.localeCompare(b)));
    });

    it('should set and sort alphabetically the "options" columns', () => {
      expect(component.availableOptionsColumns).toEqual(optionsColumns.sort((a: string, b: string) => a.localeCompare(b)));
    });

    it('should set, sort alphabetically and map the "customs" columns', () => {
      expect(component.availableCustomColumns).toEqual(customColumns.sort((a: string, b: string) => a.localeCompare(b)).map(c => c.replace('options.options.', '')));
    });
  });

  test('toCustom should turn a string into a custom column', () => {
    const value = 'column';
    expect(component.toCustom(value)).toEqual(`options.options.${value}`);
  });

  describe('isCustomColumn', () => {
    it('should return true in case of a custom column', () => {
      expect(component.isCustomColumn(customColumns[0])).toBeTruthy();
    });

    it('should return false in case of a normal column', () => {
      expect(component.isCustomColumn(columns[0])).toBeFalsy();
    });
  });

  describe('isSelected', () => {
    it('should return true in case of a selected normal column', () => {
      expect(component.isSelected(currentColumns[0])).toBeTruthy();
    });

    it('should return false in case of unselected normal column', () => {
      expect(component.isSelected(optionsColumns[0])).toBeFalsy();
    });
  });

  describe('updateColumn', () => {
    it('should add a column on check', () => {
      const checkEvent = { checked: true } as MatCheckboxChange;
      component.updateColumn(checkEvent, optionsColumns[1]);
      expect(component.columns).toContain(optionsColumns[1]);
    });

    it('should add a column on unchecked', () => {
      const checkEvent = { checked: false } as MatCheckboxChange;
      component.updateColumn(checkEvent, 'id');
      expect(component.columns).not.toContain('id');
    });
  });

  it('should close on "No Click"', () => {
    component.onNoClick();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });
});