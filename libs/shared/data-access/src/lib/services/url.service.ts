import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, map, tap } from "rxjs";

@Injectable()
export class URLService {
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) { }

  /**
   * Get a query param using his name.
   * @param name
   *
   * @returns string | undefined
   */
  public getQueryParams(name: string): string | undefined {
    return this._activatedRoute.snapshot.queryParams[name];
  }

  /**
   * Get an observable of query param using his name.
   * @param name
   *
   * @returns Observable<string | undefined>
   */
  public getQueryParams$(name: string): Observable<string | undefined> {
    return this._activatedRoute.queryParams.pipe(map(params => params[name]));
  }

  /**
   * Get an uri of current route.
   */
  public currentURI() {
    return this._activatedRoute.snapshot.url.map((segment) => segment.path).join('/');
  }

  /**
   * Update query params of the current route.
   *
   * If active route has no query params, we override replace the URL (override url in history).
   * Otherwise, we just push new url to history.
   * @param queryParams
   */
  public updateQueryParams(queryParams: Record<string, string | number>) {
    if (Object.keys(this._activatedRoute.snapshot.queryParams).length === 0) {
      this._router.navigate([], { queryParams, replaceUrl: true });
      return;
    }

    this._router.navigate([], { queryParams });
  }

  /**
   * Reset a set of query params to their default value by removing unnecessary query params.
   */
  public resetQueryParamsByRemoving(queryParamsToRemove: string[]) {
    const currentQueryParams = Object.assign({}, this._activatedRoute.snapshot.queryParams) as Record<string, string | number>;

    for (const key of queryParamsToRemove) {
      currentQueryParams[key] = '';
    }

    console.log(currentQueryParams);
    this.updateQueryParams(currentQueryParams);
  }

  /**
   * Keep only a set of query params and remove the rest.
   */
  public resetQueryParamsByKeeping(queryParamsToKeep: string[]) {
    const currentQueryParams = Object.assign({}, this._activatedRoute.snapshot.queryParams) as Record<string, string | number>;

    const newQueryParams = {} as Record<string, string | number>;

    for (const key of queryParamsToKeep) {
      newQueryParams[key] = currentQueryParams[key];
    }

    this.updateQueryParams(newQueryParams);
  }
}
