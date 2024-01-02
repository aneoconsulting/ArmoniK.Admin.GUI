import { TestBed } from '@angular/core/testing';
import { NotificationService } from '@services/notification.service';
import { ShowPageComponent } from './show-page.component';

describe('ShowPageComponent', () => {
  let component: ShowPageComponent;

  const mockNotificationService = {
    success: jest.fn()
  };
  
  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ShowPageComponent,
        {provide: NotificationService, useValue: mockNotificationService}
      ]
    }).inject(ShowPageComponent);
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should call a notification success on copy', () => {
    component.onCopiedTaskId();
    expect(mockNotificationService.success).toHaveBeenCalledWith('Task ID copied to clipboard');
  });

  it('should emit on cancel', () => {
    const cancelSpy = jest.spyOn(component.cancel, 'emit');
    component.onCancel();
    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should emit on refresh', () => {
    const refreshSpy = jest.spyOn(component.refresh, 'emit');
    component.onRefresh();
    expect(refreshSpy).toHaveBeenCalled();
  });
});