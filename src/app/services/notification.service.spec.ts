import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('Notification service', () => {
  let service: NotificationService;

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        NotificationService,
        {provide: MatSnackBar, useValue: {
          open: () => {
            return jest.fn();
          }
        }}
      ]
    }).inject(NotificationService);
  });

  it('should create Notification service', () => {
    expect(service).toBeTruthy();
  });
  
  it('should open a snackBar error', () => {
    service.error('Attention');
    expect(service.displaySnackBar('Attention', 'Close', 'warning')).toHaveBeenCalled();
  });

});