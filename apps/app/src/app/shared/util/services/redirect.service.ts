import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RedirectService {
  constructor(private _router: Router) {}

  public notFound(message: string = 'Not found') {
    this._router.navigate(['/404'], {
      queryParams: { message },
    });
  }

  public unauthenticated(message: string = 'You are not authenticated') {
    this._router.navigate(['/401'], {
      queryParams: { message },
    });
  }

  public forbidden(message: string = 'You are not authorized') {
    this._router.navigate(['/403'], {
      queryParams: { message },
    });
  }

  public error(message: string = 'An error occurred') {
    this._router.navigate(['/error'], {
      queryParams: { message },
    });
  }
}
