import { ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { StatusColorPickerDialogComponent } from './status-color-picker.dialog.component';

describe('StatusColorPickerDialogComponent', () => {
  let component: StatusColorPickerDialogComponent<ResultStatus>;

  const mockIconsService = {
    getIcon: jest.fn(),
  };

  const mockClipboard = {
    copy: jest.fn()
  };

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
  };

  const mockDialogRef = {
    close: jest.fn()
  };

  const mockDialogData = {
    current: {
      [ResultStatus.RESULT_STATUS_ABORTED]: {
        label: 'Aborted',
        color: '#00FF00'
      },
      [ResultStatus.RESULT_STATUS_COMPLETED]: {
        label: 'Completed',
        color: '#FF0000'
      },
    },
    default: {
      [ResultStatus.RESULT_STATUS_ABORTED]: {
        label: 'Aborted',
        color: '#0000FF'
      },
      [ResultStatus.RESULT_STATUS_COMPLETED]: {
        label: 'Completed',
        color: '#F0000F'
      },
    },
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        StatusColorPickerDialogComponent,
        { provide: IconsService, useValue: mockIconsService },
        { provide: Clipboard, useValue: mockClipboard },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ]
    }).inject(StatusColorPickerDialogComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should set the statuses', () => {
      expect(component.statuses).toEqual([ResultStatus.RESULT_STATUS_COMPLETED, ResultStatus.RESULT_STATUS_ABORTED]);
    });

    it('should set the statusForm', () => {
      expect(component.statusesForm.value).toEqual({
        [ResultStatus.RESULT_STATUS_ABORTED]: '#00FF00',
        [ResultStatus.RESULT_STATUS_COMPLETED]: '#FF0000',
      });
    });

    it('should set the default statuses', () => {
      expect(component.statusesDefault).toEqual(mockDialogData.default);
    });
  });

  it('should return the control of a specific status', () => {
    expect(component.getControl(ResultStatus.RESULT_STATUS_COMPLETED)).toBeInstanceOf(FormControl<string>);
  });

  describe('copy', () => {
    it('should copy the color of the status', () => {
      component.copy(ResultStatus.RESULT_STATUS_ABORTED);
      expect(mockClipboard.copy).toHaveBeenCalledWith(mockDialogData.current[ResultStatus.RESULT_STATUS_ABORTED].color.replace('#', ''));
    });

    it('should notify on successfull copy', () => {
      component.copy(ResultStatus.RESULT_STATUS_ABORTED);
      expect(mockNotificationService.success).toHaveBeenCalled();
    });

    it('should notify on error', () => {
      component.copy(ResultStatus.RESULT_STATUS_DELETED);
      expect(mockNotificationService.error).toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    const status = ResultStatus.RESULT_STATUS_ABORTED;
    let control: FormControl<string> | null;
    beforeEach(() => {
      control = component.getControl(status);
      control?.setValue('red');
      component.reset(status);
    });

    it('should reset the form to its initial value', () => {
      expect(control?.value).toEqual(mockDialogData.current[status].color);
    });

    it('should not be dirty', () => {
      expect(control?.dirty).toBeFalsy();
    });
  });

  describe('resetDefault', () => {
    const status = ResultStatus.RESULT_STATUS_ABORTED;
    let control: FormControl<string> | null;
    beforeEach(() => {
      control = component.getControl(status);
      component.resetDefault(status);
    });

    it('should reset the form to its default value', () => {
      expect(control?.value).toEqual(mockDialogData.default[status].color);
    });

    it('should mark the form as dirty', () => {
      expect(control?.dirty).toBeTruthy();
    });
  });

  it('should get icon', () => {
    const icon = 'heart';
    component.getIcon(icon);
    expect(mockIconsService.getIcon).toHaveBeenCalledWith(icon);
  });

  it('should close without any data', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalledWith();
  });

  it('should close with data on submit', () => {
    component.submit();
    expect(mockDialogRef.close).toHaveBeenCalledWith(mockDialogData.current); // We havent changed anything, so we should get what we gibed to the component
  });
});