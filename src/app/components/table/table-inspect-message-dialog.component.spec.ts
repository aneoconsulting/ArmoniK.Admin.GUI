import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { TableInspectMessageDialogComponent, TableInspectMessageDialogData } from './table-inspect-message-dialog.component';

describe('TableInspectMessageDialogComponent', () => {
  let component: TableInspectMessageDialogComponent;

  const label = 'Message';

  const message = 'A long and complete message';

  const mockMatDialogRef = {
    close: jest.fn()
  };

  const mockData: TableInspectMessageDialogData = {
    label: label,
    message: message,
  };

  const mockNotificationService = {
    success: jest.fn(),
  };

  const mockClipboard = {
    copy: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        TableInspectMessageDialogComponent,
        IconsService,
        { provide: Clipboard, useValue: mockClipboard },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).inject(TableInspectMessageDialogComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get label', () => {
    expect(component.label).toEqual(label);
  });

  it('should get message', () => {
    expect(component.message).toEqual(message);
  });

  describe('onCopy', () => {
    beforeEach(() => {
      component.copy();
    });

    it('should copy the message', () => {
      expect(mockClipboard.copy).toHaveBeenCalledWith(message);
    });

    it('should notify the user', () => {
      expect(mockNotificationService.success).toHaveBeenCalled();
    });
  });

  it('should get icon', () => {
    expect(component.getIcon('heart')).toEqual('favorite');
  });

  it('should close dialog', () => {
    component.onNoClick();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });
});