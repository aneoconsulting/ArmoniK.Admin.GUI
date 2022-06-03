import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

/**
 * Used to manage the browser tab title
 */
@Injectable({
  providedIn: 'root',
})
export class BrowserTitleService {
  private suffix = ' | Armonik';

  constructor(private titleService: Title) {}

  setTitle(title: string): void {
    this.titleService.setTitle(title + this.suffix);
  }

  get title() {
    return this.titleService.getTitle();
  }
}
