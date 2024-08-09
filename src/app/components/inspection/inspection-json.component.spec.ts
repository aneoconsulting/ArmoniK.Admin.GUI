import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { InspectionJsonComponent } from './inspection-json.component';

describe('InspectionJsonComponent', () => {
  let component: InspectionJsonComponent;

  const data = {
    one: 1,
    two: 2,
    object: {
      three: 3
    },
    array: [1, 2, 3]
  };

  const mockNotificationService = {
    success: jest.fn(),
  };

  const mockClipboard = {
    copy: jest.fn(),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        InspectionJsonComponent,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Clipboard, useValue: mockClipboard },
        IconsService,
      ]
    }).inject(InspectionJsonComponent);
    component.data = data;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set data', () => {
    expect(component.data).toEqual(data);
  });

  describe('copy', () => {
    beforeEach(() => {
      component.copy();
    });

    it('should copy to clipboard', () => {
      expect(mockClipboard.copy).toHaveBeenCalledWith(JSON.stringify(data, null, 2));
    });

    it('should notify on copy', () => {
      expect(mockNotificationService.success).toHaveBeenCalled();
    });
  });
});