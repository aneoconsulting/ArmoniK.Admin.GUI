import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Application } from '@armonik.admin.gui/armonik-typing';
import { catchError, Observable } from 'rxjs';
import { ApplicationsService, ErrorService } from '../../../../core';

@Injectable()
export class DashboardApplicationsResolver
  implements Resolve<Application[] | null>
{
  constructor(
    private errorService: ErrorService,
    private applicationsServices: ApplicationsService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Application[] | null> {
    return this.applicationsServices
      .getAll()
      .pipe(catchError((error) => this.errorService.handleError(route, error)));
  }
}
