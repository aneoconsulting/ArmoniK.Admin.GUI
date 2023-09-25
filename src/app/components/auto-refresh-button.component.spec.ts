import { TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject } from 'rxjs';
import { IconsService } from '@services/icons.service';
import { AutoRefreshButtonComponent } from './auto-refresh-button.component';

describe('Auto-refresh component', () => {
  let component: AutoRefreshButtonComponent;
  let intervalValueChangeSpy: jest.SpyInstance;
  let dialogSubject: BehaviorSubject<number | undefined>;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        AutoRefreshButtonComponent,
        { provide: MatDialog, useValue: 
          {
            open: () => {
              return {
                afterClosed: () => {
                  return dialogSubject;
                }
              };
            }
          } },
        { provide: MatDialogModule, useValue: {} },
        { provide: MatButtonModule, useValue: {} },
        { provide: MatIconModule, useValue: {} },
        { provide: IconsService, useValue: {} }
      ]
    }).inject(AutoRefreshButtonComponent);

    intervalValueChangeSpy = jest.spyOn(component, 'emit');
  });

  it('Should run', () => {
    expect(component).toBeTruthy();
  });

  it('Should call emit when a value is selected', () => {
    dialogSubject = new BehaviorSubject<number | undefined>(2);
    component.openAutoRefreshDialog();
    expect(intervalValueChangeSpy).toHaveBeenCalledWith(2);
  });

  it('Should not call emit when no value is selected', () => {
    dialogSubject = new BehaviorSubject<number | undefined>(undefined);
    component.openAutoRefreshDialog();
    expect(intervalValueChangeSpy).toHaveBeenCalledTimes(0);
  });
});