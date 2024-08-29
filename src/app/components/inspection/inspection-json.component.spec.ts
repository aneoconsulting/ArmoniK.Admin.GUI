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
    error: jest.fn(),
  };

  const mockClipboard = {
    copy: jest.fn(),
  };

  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

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
    it('should copy to clipboard', () => {
      component.copy();
      expect(mockClipboard.copy).toHaveBeenCalledWith(JSON.stringify(data, null, 2));
    });

    it('should notify on copy', () => {
      component.copy();
      expect(mockNotificationService.success).toHaveBeenCalled();
    });

    it('should log in case of an error', () => {
      jest.spyOn(JSON, 'stringify').mockImplementationOnce(() => {throw new Error;});
      component.copy();
      expect(errorSpy).toHaveBeenCalled();
    });

    it('should notify in case of an error', () => {
      jest.spyOn(JSON, 'stringify').mockImplementationOnce(() => {throw new Error;});
      component.copy();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });
  });

  describe('toggleDisplay', () => {
    it('should set display to true if it is false', () => {
      component.display = false;
      component.toggleDisplay();
      expect(component.display).toBeTruthy();
    });

    it('should set display to false if it is true', () => {
      component.display = true;
      component.toggleDisplay();
      expect(component.display).toBeFalsy();
    });
  });
});