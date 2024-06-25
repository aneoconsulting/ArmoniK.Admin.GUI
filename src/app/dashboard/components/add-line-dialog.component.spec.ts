import { MatDialogRef } from '@angular/material/dialog';
import { AddLineDialogData, AddLineDialogResult } from '@app/types/dialog';
import { AddLineDialogComponent } from './add-line-dialog.component';
import { LineType } from '../types';

describe('FormNameLineComponent', () => {
  const mockDialogRef = {
    close: jest.fn()
  } as unknown as MatDialogRef<AddLineDialogComponent, AddLineDialogResult>;

  const data: AddLineDialogData = {
    name: 'line',
    type: 'Applications'
  };

  let component: AddLineDialogComponent;

  beforeEach(() => {
    component= new AddLineDialogComponent(mockDialogRef, data);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should init type', () => {
      expect(component.type).toEqual('Applications');
    });

    it('should init validType', () => {
      expect(component.isValidType).toBeTruthy();
    });

    it('should init formGroup name value', () => {
      expect(component.formGroup.value.name).toEqual('line');
    });
  });

  describe('initialisation without data', () => {
    beforeEach(() => {
      component = new AddLineDialogComponent(mockDialogRef);
    });

    it('should init type', () => {
      expect(component.type).toBeUndefined();
    });

    it('should init validType', () => {
      expect(component.validType).toBeFalsy();
    });

    it('should init formGroup name', () => {
      expect(component.formGroup.value.name).toEqual(null);
    });
  });

  it('should cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  describe('isValidType', () => {
    it('should return true if it finds a type', () => {
      expect(component.isValidType('Applications')).toBeTruthy();
    });

    it('should return false if it does not find a type', () => {
      expect(component.isValidType('Invalid')).toBeFalsy();
    });
  });

  describe('onSubmit', () => {
    it('should submit if there is a valid type value', () => {
      component.formGroup.value.name = 'line';
      component.onSubmit();
      expect(mockDialogRef.close).toHaveBeenCalledWith({name: 'line', type: 'Applications'});
    });

    it('should submit even if there is no name', () => {
      component.formGroup.controls.name.setValue(null);
      component.onSubmit();
      expect(mockDialogRef.close).toHaveBeenCalledWith({name: '', type: 'Applications'});
    });

    it('should not submit if there is a invalid type value', () => {
      component.formGroup.value.name = 'line';
      component.type = 'Invalid' as LineType;
      component.validType = component.isValidType(component.type);
      component.onSubmit();
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });
  });

  describe('onTypeChange', () => {
    const newType: LineType = 'Results';
    beforeEach(() => {
      component.onTypeChange(newType);
    });

    it('should set component type',() => {
      expect(component.type).toEqual(newType);
    });

    it('should valid the type', () => {
      expect(component.validType).toBeTruthy();
    });
  });
});