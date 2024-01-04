import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditNameLineDialogComponent } from './edit-name-line-dialog.component';

describe('', () => {
  let component: EditNameLineDialogComponent;

  const mockMatDialogRef = {
    close: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        EditNameLineDialogComponent,
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {name: 'name'} }
      ]
    }).inject(EditNameLineDialogComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    component.ngOnInit();
    expect(component.name).toEqual('name');
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