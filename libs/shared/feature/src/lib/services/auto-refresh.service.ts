import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class AutoRefreshService {
  public intervalQueryParam(queryParams: ActivatedRouteSnapshot['queryParams']): number {
    return queryParams['interval'] ? parseInt(queryParams['interval']) : 10000
  }
}
