import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StorageService } from '@services/storage.service';

@Component({
  selector: 'app-theme-selector',
  template: `
<button mat-button class="theme" [matMenuTriggerFor]="themeMenu" i18n-aria-label aria-label="Choose a theme" matTooltip="Select a theme">
  <mat-icon matListItemIcon aria-hidden="true" fontIcon="format_color_fill"></mat-icon>
</button>
<mat-menu #themeMenu="matMenu">
  <button mat-menu-item *ngFor="let theme of availableThemes" (click)="updateTheme(theme.name)">
    <span>{{ theme.displayName }}</span>
    <mat-icon role="img" class="mat-icon mat-icon-no-color" [class]="theme.name" aria-hidden="true" data-mat-icon-type="svg">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="0 0 80 80" fit="" preserveAspectRatio="xMidYMid meet" focusable="false">
        <defs>
          <path d="M77.87 0C79.05 0 80 .95 80 2.13v75.74c0 1.17-.95 2.13-2.13 2.13H2.13C.96 80 0 79.04 0 77.87V2.13C0 .95.96 0 2.13 0h75.74z" id="a"></path>
          <path d="M54 40c3.32 0 6 2.69 6 6 0 1.2 0-1.2 0 0 0 3.31-2.68 6-6 6H26c-3.31 0-6-2.69-6-6 0-1.2 0 1.2 0 0 0-3.31 2.69-6 6-6h28z" id="b"></path>
          <path d="M0 0h80v17.24H0V0z" id="c"></path>
        </defs>
        <use xlink:href="#a" fill="#fff" class="docs-theme-icon-background"></use>
        <use xlink:href="#b" fill="#ff4081" class="docs-theme-icon-button"></use>
        <use xlink:href="#c" fill="#3f51b5" class="docs-theme-icon-toolbar"></use>
      </svg>
    </mat-icon>
  </button>
</mat-menu>
  `,
  styles: [`

  `],
  standalone: true,
  providers: [
  ],
  imports: [
    NgFor,
    NgIf,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
  ],
})
export class ThemeSelectorComponent implements OnInit {
  #storageService = inject(StorageService);

  #themeStorageKey = 'theme';

  currentTheme: string | null;
  availableThemes = [
    { name: 'deeppurple-amber', displayName: 'Deep Purple & Amber' },
    { name: 'indigo-pink', displayName: 'Indigo & Pink' },
    { name: 'pink-bluegrey', displayName: 'Pink & Blue-grey' },
    { name: 'purple-green', displayName: 'Purple & Green' },
  ];

  ngOnInit(): void {
    const theme = this.#storageService.getItem<string>(this.#themeStorageKey);

    if (theme) {
      this.currentTheme = theme;
      this.#addTheme(theme);
    }
  }

  updateTheme(themeName: string) {
    if (!themeName) {
      return;
    }

    if(this.currentTheme) {
      this.#removeTheme(this.currentTheme);
    }

    if (themeName !== 'indigo-pink') {
      this.#addTheme(themeName);
      this.currentTheme = themeName;
    } else {
      this.currentTheme = null;
    }

    this.#storageService.setItem(this.#themeStorageKey, this.currentTheme);
  }

  #removeTheme(themeName: string) {
    const theme = this.availableThemes.find(t => t.name === themeName);
    if (!theme) {
      return;
    }

    const themeElement = document.getElementById(`theme-${theme.name}`);
    if (!themeElement) {
      return;
    }

    themeElement.remove();

    const body = document.getElementsByTagName('body')[0];
    body.classList.remove(theme.name);
  }

  #addTheme(themeName: string) {
    const theme = this.availableThemes.find(t => t.name === themeName);

    if (!theme) {
      return;
    }

    const head = document.getElementsByTagName('head')[0];
    const themeElement = document.createElement('link');

    themeElement.id = `theme-${theme.name}`;
    themeElement.rel = 'stylesheet';
    themeElement.href = `${theme.name}.css`;

    head.appendChild(themeElement);

    const body = document.getElementsByTagName('body')[0];
    body.classList.add(theme.name);
  }
}
