import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

/**
 * Service to manage the URL for the table.
 * It's a low level service that should be used by the TableService.
 */
@Injectable()
export class TableURLService {
  constructor(private _route: ActivatedRoute, private _router: Router) {}

  getQueryParams<T>(key: string, parse = true) {
    const data = this._route.snapshot.queryParamMap.get(key);

    if(data && parse) {
      return JSON.parse(data) as T;
    } else if (data) {
      return data as T;
    }

    return null;
  }

  // Maybe, it's not necessary to add query to the URL but a button to share the URL can be a better idea.
  navigate(queryParams: Record<string, unknown>) {
    this._router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
