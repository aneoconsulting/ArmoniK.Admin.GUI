import { MatDialogRef } from '@angular/material/dialog';
import { AutoRefreshDialogData } from '@app/types/dialog';
import { AutoRefreshDialogComponent } from './auto-refresh-dialog.component';

describe('AutoRefreshDialogComponent', () => {
  const model: AutoRefreshDialogData = {
    value: 3
  };
  const matDialogRef = {
    close: () => jest.fn()
  } as unknown as MatDialogRef<AutoRefreshDialogComponent>;
  const component = new AutoRefreshDialogComponent(matDialogRef, model);


  it('Should run', () => {
    expect(component).toBeTruthy();
  });

  it('Should have the value defined by the dialog ref', () => {
    expect(component.value).toEqual(model.value);
  });

  describe('onNumberChange should change value on event', () => {
    it('when value is a number', () => {
      const value = '2' ;
      component.onNumberChange(value);
      expect(component.value).toEqual(2);
    });
    it('when value is a not a number', () => {
      const value = 'Not a Number';
      component.onNumberChange(value);
      expect(component.value).toEqual(0);
    });
    it('when value is null', () => {
      const value = '';
      component.onNumberChange(value);
      expect(component.value).toEqual(0);
    });
  });

  it('Should call dialogRef.close on onNoClick', () => {
    const mySpy = jest.spyOn(component.dialogRef, 'close');
    component.onNoClick();
    expect(mySpy).toHaveBeenCalled();
  });
});