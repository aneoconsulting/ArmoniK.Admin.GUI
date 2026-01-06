import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation.dialog';
import { ConfirmationDialogData } from './type';

describe('ConfirmationDialogComponent', () => { 
  let component: ConfirmationDialogComponent;

  const mockDialogRef = {
    close: jest.fn(),
  } as unknown as MatDialogRef<ConfirmationDialogComponent>;

  const mockData: ConfirmationDialogData = {
    title: 'Dialog test',
    content: ['This text should be displayed', 'on two different lines'],
    actions: {
      cancel: 'Cancel',
      confirm: 'Confirm'
    }
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ConfirmationDialogComponent,
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ]
    }).inject(ConfirmationDialogComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close with the provided value', () => {
    const value = true;
    component.close(value);
    expect(mockDialogRef.close).toHaveBeenCalledWith(value);
  });
});