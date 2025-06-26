import { ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { StatusLabelColor, StatusService } from '@app/types/status';
import { IconsService } from '@services/icons.service';
import { BehaviorSubject } from 'rxjs';
import { StatusColorPickerComponent } from './status-color-picker.component';
import { StatusColorPickerDialogComponent } from './status-color-picker.dialog.component';

describe('StatusColorPickerComponent', () => {
  let component: StatusColorPickerComponent<ResultStatus>;

  const mockStatusService = {
    statuses: {
      [ResultStatus.RESULT_STATUS_ABORTED]: {
        label: 'Aborted',
        color: 'red'
      },
      [ResultStatus.RESULT_STATUS_COMPLETED]: {
        label: 'Completed',
        color: 'green'
      },
    },
    getDefault: jest.fn(() => {
      return {
        [ResultStatus.RESULT_STATUS_ABORTED]: {
          label: 'Aborted',
          color: 'blue'
        },
        [ResultStatus.RESULT_STATUS_COMPLETED]: {
          label: 'Completed',
          color: 'purple'
        },
      };
    }),
    updateStatuses: jest.fn(),
  };

  const mockIconsService = {
    getIcon: jest.fn()
  };

  const mockDialogReturnData = {
    [ResultStatus.RESULT_STATUS_ABORTED]: {
      label: 'Aborted',
      color: 'orange'
    },
    [ResultStatus.RESULT_STATUS_COMPLETED]: {
      label: 'Completed',
      color: 'yellow'
    },
  } as Record<ResultStatus, StatusLabelColor>;

  const mockDialog = {
    open: jest.fn(() => {
      return {
        afterClosed: jest.fn(() => new BehaviorSubject<Record<ResultStatus, StatusLabelColor>>(mockDialogReturnData))
      };
    }),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        StatusColorPickerComponent,
        { provide: IconsService, useValue: mockIconsService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: StatusService, useValue: mockStatusService },
      ]
    }).inject(StatusColorPickerComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve icons', () => {
    const icon = 'heart';
    component.getIcon(icon);
    expect(mockIconsService.getIcon).toHaveBeenCalledWith(icon);
  });

  describe('openDialog', () => {
    beforeEach(() => {
      component.openDialog();
    });

    it('should open the dialog', () => {
      expect(mockDialog.open).toHaveBeenCalledWith(
        StatusColorPickerDialogComponent<ResultStatus>,
        {
          data: {
            current: mockStatusService.statuses,
            default: mockStatusService.getDefault()
          }
        }
      );
    });

    it('should update the result after the close', () => {
      expect(mockStatusService.updateStatuses).toHaveBeenCalledWith(mockDialogReturnData);
    });
  });
});