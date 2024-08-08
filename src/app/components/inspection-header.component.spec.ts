import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { InspectionHeaderComponent } from './inspection-header.component';

describe('InspectionHeaderComponent', () => {
  let component: InspectionHeaderComponent;

  const id = 'id';

  const mockNotificationService = {
    success: jest.fn()
  };

  const mockClipboard = {
    copy: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        InspectionHeaderComponent,
        IconsService,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Clipboard, useValue: mockClipboard }
      ]
    }).inject(InspectionHeaderComponent);
    component.id = id;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('id', () => {
    it('should have set "id"', () => {
      expect(component.id).toEqual(id);
    });

    it('should not change "id" if a null value is provided', () => {
      component.id = null;
      expect(component.id).toEqual(id);
    });
  });

  it('should set "status"', () => {
    const status = 'Completed';
    component.status = status;
    expect(component.status).toEqual(status);
  });

  it('should set "sharableURL"', () => {
    const url = 'https://localhost';
    component.sharableURL = url;
    expect(component.sharableURL).toEqual(url);
  });

  it('should get icons', () => {
    expect(component.getIcon('share')).toBeDefined();
  });

  describe('onCopyId', () => {
    beforeEach(() => {
      component.onCopyId();
    });

    it('should call copyService "copy"', () => {
      expect(mockClipboard.copy).toHaveBeenCalledWith(id);
    });

    it('should call notificationService "success"', () => {
      expect(mockNotificationService.success).toHaveBeenCalled();
    });
  });
});