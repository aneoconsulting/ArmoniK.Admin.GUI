import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  constructor(private titleService: Title) {}

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle + ' | Armonik');
  }
}
