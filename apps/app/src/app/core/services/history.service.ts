import { Injectable } from '@angular/core';

@Injectable()
export class HistoryService {
  #history: Set<string> = new Set<string>();
  #maxHistorySize = 3;
  /**
   * Add a new url to the history
   *
   * @param url
   */
  public add(url: string) {
    // Use to up a URL already in the history
    if (this.#history.has(url)) {
      this.#history.delete(url);
    }

    this.#history.add(url);

    // Remove the oldest URL if the history is too big
    if (this.#history.size > this.#maxHistorySize) {
      this.#history.delete(this.#history.values().next().value);
    }
  }

  /**
   * Get the history
   *
   * @returns History
   */
  public get history(): Set<string> {
    return new Set([...this.#history].reverse());
  }
}
