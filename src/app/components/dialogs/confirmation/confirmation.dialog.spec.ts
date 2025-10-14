import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation.dialog';

describe('ConfirmationDialogComponent', () => { 
  let component: ConfirmationDialogComponent;

  const mockData = 'Are you sure ?';

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ConfirmationDialogComponent,
        { provide: MAT_DIALOG_DATA, useValue: mockData },
      ]
    }).inject(ConfirmationDialogComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});