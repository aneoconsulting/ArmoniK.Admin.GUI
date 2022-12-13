import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Params, UrlSerializer } from '@angular/router';

export type HistoryItem = {
  title: string;
  url: string;
  queryParams: Params;
};

@Injectable()
export class HistoryService {
  private _maxHistorySize = 3;

  private _historySubject = new BehaviorSubject<Set<string>>(new Set());
  private _history$: Observable<Set<string>> =
    this._historySubject.asObservable();

  constructor(
    private _localStorage: Storage,
    private _urlSerializer: UrlSerializer
  ) {
    this._historySubject.next(this._recover());
  }

  private get _history(): Set<string> {
    return this._historySubject.value;
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
      }),
      tap((history) => console.log(history))
    );
  }

  /**
   * Add a new url to the history
   *
   * @param url
   */
  public add(url: string) {
    // Used to pull up a URL already in the history
    if (this._history.has(url)) {
      this._history.delete(url);
    }

    this._history.add(url);

    // Remove the oldest URL if the history is too big
    if (this._history.size > this._maxHistorySize) {
      this._history.delete(this._history.values().next().value);
    }

    this._historySubject.next(this._history);

    this._store();
  }

  /**
   * Store history in local storage
   */
  private _store(): void {
    this._localStorage.setItem('history', JSON.stringify([...this._history]));
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
