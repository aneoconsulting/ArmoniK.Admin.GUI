
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('Notification service', () => {
  let service: NotificationService;
  const snackBar = {
    open:  jest.fn()
  };

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        NotificationService,
        {provide: MatSnackBar, useValue: snackBar}
      ]
    }).inject(NotificationService);
  });

  it('should create Notification service', () => {
    expect(service).toBeTruthy();
  });
  
  it('should open a snackBar with success status', () => {
    const status = {
      duration: 5000,
      horizontalPosition: 'end',
      panelClass: 'success'
    }; 
    const spy = jest.spyOn(snackBar, 'open');
    service.success('succes');
    expect(spy).toHaveBeenCalledWith('succes', 'Close', status);
  });

  it('should open a snackBar with warning status', () => {
    const status = {
      duration: 5000,
      horizontalPosition: 'end',
      panelClass: 'warning'
    };
    const spy = jest.spyOn(snackBar, 'open');
    service.warning('attention');
    expect(spy).toHaveBeenCalledWith('attention', 'Close', status);
  });

  it('should open a snackBar with error status', () => {
    const status = {
      duration: 5000,
      horizontalPosition: 'end',
      panelClass: 'error'
    };
    const spy = jest.spyOn(snackBar, 'open');
    service.error('erreur');
    expect(spy).toHaveBeenCalledWith('erreur', 'Close', status);
  });
  
});