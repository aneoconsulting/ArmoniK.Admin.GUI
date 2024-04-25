import { MatDialogRef } from '@angular/material/dialog';
import { EditNameLineResult } from '@app/types/dialog';
import { EditNameLineDialogComponent } from './edit-name-line-dialog.component';

describe('', () => {
  const mockMatDialogRef = {
    close: jest.fn()
  } as unknown as MatDialogRef<EditNameLineDialogComponent, EditNameLineResult>;

  const defaultName = 'Tasks';

  const component = new EditNameLineDialogComponent(mockMatDialogRef, {
    name: defaultName
  });

  component.ngOnInit();

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    expect(component.nameForm).toBeDefined();
  });

  describe('onSubmit', () => {
    it('should close with result', () => {
      component.nameForm.setValue({name: 'result'});
      component.onSubmit();
      expect(mockMatDialogRef.close).toHaveBeenCalledWith('result');
    });

    it('should close with previous name', () => {
      component.nameForm.setValue({name: ''});
      component.onSubmit();
      expect(mockMatDialogRef.close).toHaveBeenCalledWith(defaultName);
    });
  });

  it('should close on "no" click', () => {
    component.onNoClick();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });
});