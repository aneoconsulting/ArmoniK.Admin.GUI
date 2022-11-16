import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable()
export class HistoryService {
  private _maxHistorySize = 3;

  private _history: Set<string> = new Set<string>();
  private _historySubject = new BehaviorSubject<Set<string>>(this._history);
  private _history$: Observable<Set<string>> = this._historySubject.pipe(
    tap((history) => this._store(history))
  );

  constructor(private _localStorage: Storage) {
    this._history = this._recover();
    this._historySubject.next(this._history);
  }

  public get history$(): Observable<string[]> {
    return this._history$.pipe(map((history) => [...history].reverse()));
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
  }

  /**
   * Store history in local storage
   */
  private _store(history: Set<string>): void {
    this._localStorage.setItem('history', JSON.stringify([...history]));
  }

  /**
   * Recover history from local storage
   */
  private _recover(): Set<string> {
    const history = this._localStorage.getItem('history');

    console.log(history);

    if (history) {
      return new Set<string>(JSON.parse(history));
    }

    return new Set<string>();
  }
}
