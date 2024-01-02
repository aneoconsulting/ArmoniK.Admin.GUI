import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColumnKey } from '@app/types/data';
import { ColumnsModifyDialogComponent } from './columns-modify-dialog.component';

describe('', () => {
  let component: ColumnsModifyDialogComponent<object, object>;
  let fixture: ComponentFixture<ColumnsModifyDialogComponent<object, object>>;
  const mockMatDialogRef = {
    close: jest.fn()
  };
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
    availableColumns: ['name', 'duration', 'options.task_id', 'actions']
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        ColumnsModifyDialogComponent,
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnsModifyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
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
  });

  test('availableColumns should return every column without the "options." prefix', () => {
    expect(component.availableColumns()).toEqual(['actions', 'duration', 'name']);
  });

  test('availableOptionsColumns should return every column with the "options." prefix', () => {
    expect(component.availableOptionsColumns()).toEqual(['options.task_id']);
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