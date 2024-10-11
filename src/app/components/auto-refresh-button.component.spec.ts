import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { IconsService } from '@services/icons.service';
import { of } from 'rxjs';
import { AutoRefreshButtonComponent } from './auto-refresh-button.component';

describe('Auto-refresh component', () => {
  let component: AutoRefreshButtonComponent;

  const initialDialogValue = 10;
  const afterClosed = jest.fn(() => of(initialDialogValue));
  const mockMatDialog = {
    open: jest.fn(() => {
      return {
        afterClosed
      };
    })
  };

  const initialIntervalValue = 5;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        AutoRefreshButtonComponent,
        { provide: MatDialog, useValue: mockMatDialog },
        IconsService
      ]
    }).inject(AutoRefreshButtonComponent);
    component.intervalValue = initialIntervalValue;
    component.ngOnInit();
  });

  it('Should run', () => {
    expect(component).toBeTruthy();
  });

  describe('on init', () => {
    it('should initialize intervalDisplay', () => {
      expect(component.intervalDisplay).toBe(`${initialIntervalValue} seconds`);
    });

    it('should check if the auto-refrehs is disabled', () => {
      expect(component.isDisabled).toBe(false);
    });

    it('should handle a null intervalValue', () => {
      component.intervalValue = 0;
      component.ngOnInit();
      expect(component.intervalDisplay).toBe('Disabled');
    });
  });

  it('should get icon', () => {
    expect(component.getIcon('refresh')).toBe('refresh');
  });

  describe('openAutoRefreshDialog', () => {
    it('should update the interval value', () => {
      component.openAutoRefreshDialog();
      expect(component.intervalValue).toBe(initialDialogValue);
    });

    it('should update the intervalDisplay', () => {
      component.openAutoRefreshDialog();
      expect(component.intervalDisplay).toBe(`${initialDialogValue} seconds`);
    });

    it('should disable the auto-refresh if the value is 0', () => {
      afterClosed.mockReturnValueOnce(of(0));
      component.openAutoRefreshDialog();
      expect(component.isDisabled).toBe(true);
    });

    it('should disable the button if the value is 0', () => {
      afterClosed.mockReturnValueOnce(of(0));
      component.openAutoRefreshDialog();
      expect(component.intervalDisplay).toBe('Disabled');
    });

    it('should emit the new value', () => {
      const spy = jest.spyOn(component.intervalValueChange, 'emit');
      component.openAutoRefreshDialog();
      expect(spy).toHaveBeenCalledWith(initialDialogValue);
    });
  });
});