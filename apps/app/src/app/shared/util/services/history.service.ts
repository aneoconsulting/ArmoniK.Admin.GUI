import { Injectable } from '@angular/core';
import { Params, UrlSerializer } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';

export type HistoryItem = {
  title: string;
  url: string;
  queryParams: Params;
};

@Injectable()
export class HistoryService {
  private _maxHistorySize = 3;

  private _history = new BehaviorSubject<Set<string>>(new Set());
  private _history$: Observable<Set<string>> = this._history.asObservable();

  constructor(
    private _localStorage: Storage,
    private _urlSerializer: UrlSerializer
  ) {
    this._history.next(this._recover());
  }

  private get _historyValue(): Set<string> {
    return this._history.getValue();
  }

  public get history$(): Observable<HistoryItem[]> {
    return this._history$.pipe(
      map((history) => [...history].reverse()),
      map((history) => {
        return history.map((url) => {
          const urlTree = this._urlSerializer.parse(url);
          const root = urlTree.root;
          const queryParams = urlTree.queryParams;

          if (!root.children['primary']) {
            return {
              title: url,
              url: url,
              queryParams: queryParams,
            };
          }

          return {
            title: url,
            url: root.children['primary'].segments
              .map((segment) => segment.path)
              .join('/'),
            queryParams: queryParams,
          };
        });
      })
    );
  }

  /**
   * Add a new url to the history
   *
   * @param url
   */
  public add(url: string) {
    // Used to pull up a URL already in the history
    if (this._historyValue.has(url)) {
      this._historyValue.delete(url);
    }

    this._historyValue.add(url);

    // Remove the oldest URL if the history is too big
    if (this._historyValue.size > this._maxHistorySize) {
      this._historyValue.delete(this._historyValue.values().next().value);
    }

    this._history.next(this._historyValue);

    this._store();
  }

  /**
   * Store history in local storage
   */
  private _store(): void {
    this._localStorage.setItem(
      'history',
      JSON.stringify([...this._historyValue])
    );
  }

  /**
   * Recover history from local storage
   */
  private _recover(): Set<string> {
    const history = this._localStorage.getItem('history');

    if (history) {
      return new Set<string>(JSON.parse(history));
    }

    return new Set<string>();
  }
}
