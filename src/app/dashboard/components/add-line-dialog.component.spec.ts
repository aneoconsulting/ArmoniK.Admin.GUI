import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddLineDialogComponent } from './add-line-dialog.component';

describe('AddLineDialogComponent', () => {
  let component: AddLineDialogComponent;

  const mockMatDialogRef = {
    close: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        AddLineDialogComponent,
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).inject(AddLineDialogComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close with result on submit', () => {
    component.onSubmit({name:'result', type: 'Tasks'});
    expect(mockMatDialogRef.close).toHaveBeenCalledWith({name:'result', type: 'Tasks'});
  });

  it('should close on "no" click', () => {
    component.onNoClick();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });
});