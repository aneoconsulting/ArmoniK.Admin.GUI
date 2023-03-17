import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Injectable()
export class UrlService {
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) { }

  public getQueryParams(name: string): string {
    return this._activatedRoute.snapshot.queryParams[name] as string;
  }

  public updateQueryParams(queryParams: Record<string, string | number>) {
    this._router.navigate([], { queryParams });
  }

}
