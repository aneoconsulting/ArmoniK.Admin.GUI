import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomColumn } from '@app/types/data';
import { ManageCustomColumnDialogComponent } from './manage-custom-dialog.component';

describe('ManageCustomDialogComponent', () => {
  const matDialogRef = {
    close: jest.fn()
  } as unknown as MatDialogRef<ManageCustomColumnDialogComponent, CustomColumn[]>;

  const initialCustomColumns: CustomColumn[] = ['options.options.FastCompute'];

  const component = new ManageCustomColumnDialogComponent(matDialogRef, structuredClone(initialCustomColumns));

  component.ngOnInit();

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('on init', () => {    
    it('should set existingColumnList', () => {
      expect(component.existingColumnList).toEqual(initialCustomColumns);
    });

    it('should set displayedColumnsList', () => {
      expect(component.displayedColumnsList).toEqual(['FastCompute']);
    });
  });

  describe('on add', () => {
    const event = {
      value: 'options.options.SlowCompute',
      chipInput: {
        clear: jest.fn()
      }
    } as unknown as MatChipInputEvent;

    beforeEach(() => {
      component.existingColumnList = structuredClone(initialCustomColumns);
      component.displayedColumnsList = ['FastCompute'];
    });

    it('should add a column to existing columns', () => {
      component.add(event);
      expect(component.existingColumnList).toEqual([...initialCustomColumns, event.value]);
    });

    it('should add a column to displayed columns', () => {
      component.add(event);
      expect(component.displayedColumnsList).toEqual(['FastCompute', 'SlowCompute']);
    });

    it('should not add a column if the name is empty', () => {
      event.value = '';
      component.add(event);
      expect(component.existingColumnList).toEqual(initialCustomColumns);
    });

    it('should add a columns even if it does not start with "options.options."', () => {
      event.value = 'SlowCompute';
      component.add(event);
      expect(component.existingColumnList).toEqual([...initialCustomColumns, 'options.options.SlowCompute']);
    });

    it('should not add a column if it already exists', () => {
      event.value = 'options.options.FastCompute';
      component.add(event);
      expect(component.existingColumnList).toEqual(initialCustomColumns);
    });

    it('should clear chipInput', () => {
      component.add(event);
      expect(event.chipInput.clear).toHaveBeenCalled();
    });
  });

  describe('on remove', () => {
    beforeEach(() => {
      component.existingColumnList = structuredClone(initialCustomColumns);
      component.displayedColumnsList = ['FastCompute'];
    });

    it('should remove the column from existing columns', () => {
      component.remove('FastCompute');
      expect(component.existingColumnList).toEqual([]);
    });

    it('should remove the column from displayed columns', () => {
      component.remove('FastCompute');
      expect(component.displayedColumnsList).toEqual([]);
    });
  });

  describe('on edit', () => {
    const event = {
      value: 'SlowCompute'
    } as unknown as MatChipEditedEvent;

    beforeEach(() => {
      component.existingColumnList = structuredClone(initialCustomColumns);
      component.displayedColumnsList = ['FastCompute'];
    });

    it('should edit the column inside existing columns', () => {
      component.edit('FastCompute', event);
      expect(component.existingColumnList).toEqual(['options.options.SlowCompute']);
    });

    it('should edit the column inside displayed columns', () => {
      component.edit('FastCompute', event);
      expect(component.displayedColumnsList).toEqual(['SlowCompute']);
    });

    it('should remove the column if the new name is empty', () => {
      event.value = '';
      component.edit('FastCompute', event);
      expect(component.existingColumnList).toEqual([]);
    });

    it('should remove the column if the new name already exists', () => {
      event.value = 'SlowCompute';
      component.existingColumnList.push('options.options.SlowCompute');
      component.displayedColumnsList.push('SlowCompute');
      component.edit('FastCompute', event);
      expect(component.existingColumnList).toEqual(['options.options.SlowCompute']);
    });
  });

  it('should close on no', () => {
    component.onNoClick();
    expect(matDialogRef.close).toHaveBeenCalled();
  });
});