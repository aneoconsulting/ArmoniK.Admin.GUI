import { Injectable } from '@angular/core';
import { DefaultUrlSerializer, Params, UrlTree } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable()
export class HistoryService {
  private _maxHistorySize = 3;

  private _history: Set<string> = new Set<string>();
  private _historySubject = new BehaviorSubject<Set<string>>(this._history);
  private _history$: Observable<Set<string>> =
    this._historySubject.asObservable();

  constructor(
    private _localStorage: Storage,
    private _urlSerializer: DefaultUrlSerializer
  ) {
    this._history = this._recover();
    this._historySubject.next(this._history);
  }

  public get history$(): Observable<
    {
      title: string;
      url: string;
      queryParams: Params;
    }[]
  > {
    return this._history$.pipe(
      map((history) => [...history].reverse()),
      map((history) => {
        // remove query params and transform to object
        return history.map((url) => {
          const urlTree = this._urlSerializer.parse(url);
          const root = urlTree.root;
          const queryParams = urlTree.queryParams;

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
