import { MatDialogRef } from '@angular/material/dialog';
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

  describe('onSubmit', () => {
    it('should submit if there is a value', () => {
      component.lineForm.value.name = 'line';
      component.lineForm.value.type = 'Applications';
      component.onSubmit();
      expect(mockDialogRef.close).toHaveBeenCalledWith({name: 'line', type: 'Applications'});
    });
  
    it('should submit empty if there no value', () => {
      component.lineForm.value.name = null;
      component.lineForm.value.type = null;
      component.onSubmit();
      expect(mockDialogRef.close).toHaveBeenCalledWith({name:'', type: ''});
    });
  });

  it('should cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should track by options', () => {
    expect(component.trackByType(0, 'Applications')).toEqual('Applications');
  });
});