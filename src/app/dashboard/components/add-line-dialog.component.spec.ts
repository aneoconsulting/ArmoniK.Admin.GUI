import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { AddLineDialogResult } from '@app/types/dialog';
import { AddLineDialogComponent } from './add-line-dialog.component';

describe('FormNameLineComponent', () => {
  const mockDialogRef = {
    close: jest.fn()
  } as unknown as MatDialogRef<AddLineDialogComponent, AddLineDialogResult>;

  const component = new AddLineDialogComponent(mockDialogRef, {
    name: 'line',
    type: 'Applications'
  });
  component.ngOnInit();

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    expect(component.lineForm.value.name).toEqual('line');
    expect(component.lineForm.value.type).toEqual('Applications');
  });

  it('should update filteredTypes', () => {
    component.lineForm.controls.type.setValue('ions');
    lastValueFrom(component.filteredTypes).then(types => {
      expect(types).toEqual(['Applications', 'Sessions', 'Partitions']);
    });
  });

  describe('onSubmit', () => {
    it('should submit if there is a valid type value', () => {
      component.lineForm.value.name = 'line';
      component.lineForm.value.type = 'applications';
      component.onSubmit();
      expect(mockDialogRef.close).toHaveBeenCalledWith({name: 'line', type: 'Applications'});
    });

    it('should submit even if there is no name', () => {
      component.lineForm.value.name = null;
      component.lineForm.value.type = 'applications';
      component.onSubmit();
      expect(mockDialogRef.close).toHaveBeenCalledWith({name: '', type: 'Applications'});
    });
  
    it('should set error if there is no valid type value', () => {
      component.lineForm.value.name = 'line';
      component.lineForm.value.type = 'invalid';
      component.onSubmit();
      expect(component.lineForm.controls.type.hasError('invalid')).toBeTruthy();
    });
  });

  it('should cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should select type', () => {
    component.onTypeSelected({option: {value: 'Applications'}} as MatAutocompleteSelectedEvent);
    expect(component.lineForm.value.type).toEqual('Applications');
  });

  describe('filterType', () => {
    it('should filter the types', () => {
      expect(component['filterType']('ions')).toEqual(['Applications', 'Sessions', 'Partitions']);
    });

    it('should return all types if no filter', () => {
      expect(component['filterType'](null)).toEqual(component.types);
    });
  });

  describe('getType', () => {
    it('should get a type', () => {
      expect(component['getType']('applications')).toEqual('Applications');
    });

    it('should get undefined if no type', () => {
      expect(component['getType'](null)).toBeUndefined();
    });
  });
});