import { GetCurrentUserResponse } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { GrpcAuthService } from '@armonik.admin.gui/auth/data-access';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CanActivateUser implements CanActivate {
  constructor(
    private _router: Router,
    private _grpcAuthService: GrpcAuthService,
    private _authService: AuthService
  ) {}

  canActivate(): Observable<boolean> {
    this._authService.loading$.next(true);

    return this._grpcAuthService.currentUser$().pipe(
      map((response: GetCurrentUserResponse) => {
        if (!response.user) {
          throw new Error('User not found');
        }

        this._authService.loading$.next(false);
        this._authService.user = response.user;

        return true;
      }),
      catchError((err: Error) => {
        this._authService.loading$.next(false);
        this._authService.user = null;

        this._router.navigate(['/error'], {
          queryParams: { title: err.message },
        });

        return of(false);
      })
    );
  }
}
