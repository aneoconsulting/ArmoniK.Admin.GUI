import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IconsService } from '@services/icons.service';
import { ManageViewInLogsDialogComponent } from './manage-view-in-logs-dialog.component';

describe('ManageViewInLogsDialogComponent', () => {
  let component: ManageViewInLogsDialogComponent;

  const mockDialogRef = {
    close: jest.fn(),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ManageViewInLogsDialogComponent,
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {
          serviceIcon: null,
          serviceName: null,
          urlTemplate: null,
        }},
        IconsService,
      ]
    }).inject(ManageViewInLogsDialogComponent);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init properly', () => {
    expect(component.icon).toEqual('icon');
    expect(component.viewInLogsForm.value).toEqual({
      serviceIcon: null,
      serviceName: null,
      urlTemplate: null,
    });
  });

  it('should update icons', () => {
    const newIcon = 'refresh';
    component.onIconChange(newIcon);
    expect(component.icon).toEqual(newIcon);
    expect(component.viewInLogsForm.value.serviceIcon).toEqual(newIcon);
  });

  it('should close dialog on submit', () => {
    component.onSubmit();
    expect(mockDialogRef.close).toHaveBeenCalledWith(component.viewInLogsForm.value);
  });

  it('should close dialog on "no"', () => {
    component.onNoClick();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should get icons', () => {
    expect(component.getIcon('refresh')).toEqual('refresh');
  });
});