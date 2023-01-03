import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RedirectService {
  constructor(private _router: Router) {}

  public notFound(title: string = 'Not found') {
    this._router.navigate(['/404'], {
      queryParams: { title },
    });
  }

  public unauthenticated(title: string = 'You are not authenticated') {
    this._router.navigate(['/401'], {
      queryParams: { title },
    });
  }

  public forbidden(title: string = 'You are not authorized') {
    this._router.navigate(['/403'], {
      queryParams: { title },
    });
  }

  public error(title: string = 'An error occurred') {
    this._router.navigate(['/error'], {
      queryParams: { title },
    });
  }
}
