import { Injectable } from "@angular/core";
import { StorageService } from "./storage.service";
import { URLService } from "./url.service";
import { Params } from "@angular/router";

@Injectable()
export class DatagridStorageService {
  constructor(private _storageService: StorageService, private _URLService: URLService) { }

  /**
   * Save current interval to storage.
   * @param value
   *
   * @returns void
   */
  public saveCurrentInterval(value: number | null) {
    this._storageService.save(this._intervalKey(), value)
  }

  /**
   * Restore current interval from storage.
   *
   * @returns null if value is not found in storage
   */
  public restoreCurrentInterval(): number | null {
    return this._storageService.restore(this._intervalKey()) as number | null
  }

  /**
   * Save query params to storage.
   * @param value
   * @returns void
   */
  public saveQueryParams(name: string, params: Params) {
    this._storageService.save(this._queryParamsKey(name), params)
  }

  /**
   * Restore query params from storage.
   * @returns null if value is not found in storage
   * @returns value if value is found in storage
   */
  public restoreQueryParams(name?: string): Record<string, string | number> | null {
    return this._storageService.restore(this._queryParamsKey(name)) as Record<string, string | number> | null
  }

  /**
   * Generate key for query params.
   */
  private _queryParamsKey(name?: string) {
    return (name || this._URLService.currentURI()) + '-query-params'
  }

  /**
   * Generate key for interval.
   */
  private _intervalKey() {
    return this._URLService.currentURI() + '-interval'
  }
}
