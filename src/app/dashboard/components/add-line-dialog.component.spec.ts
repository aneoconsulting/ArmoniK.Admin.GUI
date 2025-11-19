import { TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddLineDialogData } from '@app/types/dialog';
import { UserService } from '@services/user.service';
import { AddLineDialogComponent } from './add-line-dialog.component';

describe('AddLineDialogComponent', () => {
  let component: AddLineDialogComponent;
  
  const mockDialogRef = {
    close: jest.fn()
  };

  const mockUserService = {
    hasPermission: jest.fn().mockReturnValue(true),
    user: undefined
  };

  const data: AddLineDialogData = {
    name: 'line',
    type: 'Applications'
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        AddLineDialogComponent,
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: UserService, useValue: mockUserService }
      ]
    }).inject(AddLineDialogComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});