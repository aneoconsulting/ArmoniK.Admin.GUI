import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { TableInspectMessageDialogComponent } from './table-inspect-message-dialog.component';
import { TableInspectMessageComponent } from './table-inspect-message.component';

describe('TableInspectMessageComponent', () => {
  let component: TableInspectMessageComponent;

  const label = 'Message';

  const message = 'A long and complete message';

  const mockNotificationService = {
    success: jest.fn(),
  };

  const mockDialog = {
    open: jest.fn()
  };

  const mockClipboard = {
    copy: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        TableInspectMessageComponent,
        IconsService,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: Clipboard, useValue: mockClipboard }
      ]
    }).inject(TableInspectMessageComponent);
    component.label = label;
    component.message = message;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setting message', () => {
    it('should set the cropped message', () => {
      expect(component.croppedMessage).toEqual('A long and com...');
    });

    it('should display the eye', () => {
      expect(component.displayEye).toBeTruthy();
    });
  
    it('should set the full message if it not too long', () => {
      const newMessage = 'message';
      component.message = newMessage;
      expect(component.croppedMessage).toEqual(newMessage);
    });

    it('should not display the eye if the message is too long', () => {
      component.message = 'message';
      expect(component.displayEye).toBeFalsy();
    });
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

  describe('on View', () => {
    beforeEach(() => {
      component.onView();
    });

    it('should display pass the data to the dialog', () => {
      expect(mockDialog.open).toHaveBeenCalledWith(TableInspectMessageDialogComponent, {
        data: {
          label: label,
          message: message
        }
      });
    });
  });
});