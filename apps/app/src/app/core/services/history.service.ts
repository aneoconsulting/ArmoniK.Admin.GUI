import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable()
export class HistoryService {
  private _maxHistorySize = 3;

  private _history: Set<string> = new Set<string>();
  private _history$: BehaviorSubject<Set<string>> = new BehaviorSubject<
    Set<string>
  >(this._history);

  constructor(private _localStorage: Storage) {
    this._history = this._recover();
    this._history$.next(this._history);
  }

  public get history$(): Observable<string[]> {
    const history$ = this._history$.asObservable();
    return history$.pipe(map((history) => [...history].reverse()));
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
