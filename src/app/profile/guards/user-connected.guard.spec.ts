import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserService } from '@services/user.service';
import { UserConnectedGuard } from './user-connected.guard';

describe('UserConnectedGuard', () => {
  let guard: UserConnectedGuard;

  const mockRouter = {
    navigateByUrl: jest.fn(),
  };

  const mockUserService = {
    user: {} as unknown | undefined
  };

  beforeEach(() => {
    guard = TestBed.configureTestingModule({
      providers: [
        UserConnectedGuard,
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService },
      ]
    }).inject(UserConnectedGuard);
  });

  describe('user is defined', () => {
    it('should activate the route', () => {
      expect(guard.canActivate()).toBeTruthy();
    });
  });

  describe('user is undefined', () => {
    beforeEach(() => {
      mockUserService.user = undefined;
    });

    it('should not activate the route', () => {
      expect(guard.canActivate()).toBeFalsy();
    });

    it('should navigate to the dashboard', () => {
      guard.canActivate();
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/dashboard');
    });
  });
});