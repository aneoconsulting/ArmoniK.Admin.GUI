import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { NotificationService } from '@services/notification.service';
import { MessageComponent } from './message.component';

describe('MessageComponent', () => {
  let component: MessageComponent;

  const label = 'Output';
  const error = 'Error message';

  const mockNotificationService = {
    success: jest.fn(),
  };

  const mockClipboard = {
    copy: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        MessageComponent,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Clipboard, useValue: mockClipboard },
      ]
    }).inject(MessageComponent);

    component.label = label;
    component.message = error;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set label', () => {
    expect(component.label).toEqual(label);
  });

  it('should set the message', () => {
    expect(component.message).toEqual(error);
  });

  describe('copy', () => {
    beforeEach(() => {
      component.copy();
    });
    
    it('should copy the message', () => {
      expect(mockClipboard.copy).toHaveBeenCalledWith(error);
    });

    it('should notify the user', () => {
      expect(mockNotificationService.success).toHaveBeenCalled();
    });
  });
});