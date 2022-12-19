import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

/**
 * Used to manage the browser tab title
 */
@Injectable()
export class BrowserTitleService {
  private _suffix = ' | ArmoniK';

  constructor(private _titleService: Title) {}

  /**
   * Set the browser title
   *
   * @param title The title to set
   */
  setTitle(title: string): void {
    this._titleService.setTitle(title + this._suffix);
  }
}
