import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, map } from "rxjs";

@Injectable()
export class UrlService {
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) { }

  public getQueryParams(name: string): string | undefined {
    return this._activatedRoute.snapshot.queryParams[name];
  }

  public getQueryParams$(name: string): Observable<string | undefined> {
    return this._activatedRoute.queryParams.pipe(map(params => params[name]));
  }

  public updateQueryParams(queryParams: Record<string, string | number>) {
    this._router.navigate([], { queryParams });
  }

}
