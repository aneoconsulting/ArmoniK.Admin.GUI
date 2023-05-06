import { Injectable } from "@angular/core";
import { Params } from "@angular/router";
import { BehaviorSubject, map } from "rxjs";
import { DatagridStorageService } from "./datagrid-storage.service";

@Injectable()
export class DatagridService {
  private _queries: Map<string, Params> = new Map();

  private _queries$ = new BehaviorSubject<Map<string, Params>>(this._queries);

  constructor(private _datagridStorageService: DatagridStorageService) { }

  /**
   * Save a query to the application cache and to the local storage.
   */
  public saveQueryParams(name: string, params: Params) {
    this._queries.set(name, params);
    this._queries$.next(this._queries);

    this._datagridStorageService.saveQueryParams(name, params);
  }

  /**
   * Restore a query from the application cache or from the local storage.
   */
  public restoreQueryParams$(name: string) {
    return this._queries$.pipe(
      map((queries) => {
        const cachedQuery = queries.get(name);

        if (cachedQuery) {
          return cachedQuery;
        }

        const storedQuery = this._datagridStorageService.restoreQueryParams(name);

        if (storedQuery) {
          return storedQuery;
        }

        return {};
      }),
    );
  }
}
