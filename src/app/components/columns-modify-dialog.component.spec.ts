import { TestBed } from '@angular/core/testing';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColumnKey } from '@app/types/data';
import { ColumnsModifyDialogData } from '@app/types/dialog';
import { ColumnsModifyDialogComponent } from './columns-modify-dialog.component';

describe('', () => {
  let component: ColumnsModifyDialogComponent<object, object>;

  const mockMatDialogRef = {
    close: jest.fn()
  } as unknown as MatDialogRef<ColumnsModifyDialogComponent<object, object>>;

  const mockMatDialogData = {
    currentColumns: ['id', 'created_time'],
    columnsLabels: {
      'id': 'ID',
      'created_time': 'Creation time',
      'name': 'Name',
      'duration': 'Duration',
      'options.task_id': 'Task ID',
      'actions': 'Actions'
    } as Record<ColumnKey<object, object>, string>,
    availableColumns: ['name', 'duration', 'options.task_id', 'actions', 'options.options.FastCompute']
  } as ColumnsModifyDialogData<object, object>;

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

  describe('on init', () => {
    it('should load columns', () => {
      expect(component.columns).toEqual(mockMatDialogData.currentColumns);
    });

    it('should copy the columns', () => {
      expect(component.columns).not.toBe(mockMatDialogData.currentColumns);
    });

    it('should load columns labels', () => {
      expect(component.columnsLabels).toEqual(mockMatDialogData.columnsLabels);
    });
  });

  test('optionsColumnValue should add "options." to any provided string', () => {
    expect(component.optionsColumnValue('nameColumn')).toEqual('options.nameColumn');
  });

  describe('columnToLabel', () => {
    it('should get the label of the specified column', () => {
      expect(component.columnToLabel('name' as ColumnKey<object, object>))
        .toEqual('Name');
    });

    it('should return the stringified key in case of non-existing label', () => {
      expect(component.columnToLabel('nonExistingLabel' as ColumnKey<object, object>))
        .toEqual('nonExistingLabel');
    });

    it('should remove the "options.options." key from custom columns', () => {
      expect(component.columnToLabel('options.options.FastCompute')).toEqual('FastCompute');
    });
  });

  describe('isCustomColumn', () => {
    it('should be true in case of a custom column', () => {
      expect(component.isCustomColumn('options.options.FastCompute')).toBeTruthy();
    });

    it('should be false in case of a non-custom column', () => {
      expect(component.isCustomColumn('actions')).toBeFalsy();
    });
  });

  describe('Getting available columns', () => {
    it('should return every column without the "options." prefix', () => {
      expect(component.availableColumns()).toEqual(['actions', 'duration', 'name']);
    });
  
    it('should return every column with the "options." prefix', () => {
      expect(component.availableOptionsColumns()).toEqual(['options.task_id']);
    });

    it('should return every custom column', () => {
      expect(component.availableCustomColumns()).toEqual(['options.options.FastCompute']);
    });
  });

  describe('updateColumn', () => {
    it('should push a new column', () => {
      component.updateColumn({checked: true} as MatCheckboxChange, 'duration' as ColumnKey<object, object>);
      expect(component.columns).toEqual(['id', 'created_time', 'duration']);
    });

    it('should remove a column if parameter is unchecked', () => {
      component.updateColumn({checked: false} as MatCheckboxChange, 'id' as ColumnKey<object, object>);
      expect(component.columns).toEqual(['created_time']);
    });

    it('should not push a column that is already in the column list', () => {
      component.updateColumn({checked: true} as MatCheckboxChange, 'id' as ColumnKey<object, object>);
      expect(component.columns).toEqual(['id', 'created_time']);
    });

    it('should not push a column that is not in the available columns', () => {
      component.updateColumn({checked: true} as MatCheckboxChange, 'someColumn' as ColumnKey<object, object>);
      expect(component.columns).toEqual(['id', 'created_time']);
    });

    it('should not do remove a column that is not in the column list', () => {
      component.updateColumn({checked: false} as MatCheckboxChange, 'someColumn' as ColumnKey<object, object>);
      expect(component.columns).toEqual(['id', 'created_time']);
    });
  });

  describe('isSelected', () => {
    it('should return true if a column is selected', () => {
      expect(component.isSelected('id' as ColumnKey<object, object>)).toBeTruthy();
    });

    it('should return false if a column is not selected', () => {
      expect(component.isSelected('duration' as ColumnKey<object, object>)).toBeFalsy();
    });
  });

  test('onNoClick should call dialogref.close', () => {
    component.onNoClick();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });

  test('should return the column key as a string', () => {
    expect(component.trackByColumn(0, 'actions')).toEqual('actions');
  });
});