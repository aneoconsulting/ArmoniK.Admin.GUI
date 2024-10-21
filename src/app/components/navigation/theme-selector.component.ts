import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Theme } from '@app/types/themes';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { StorageService } from '@services/storage.service';

@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  styles: [`

  `],
  standalone: true,
  providers: [
  ],
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
  ],
})
export class ThemeSelectorComponent implements OnInit {
  private readonly defaultConfigService = inject(DefaultConfigService);
  private readonly storageService = inject(StorageService);
  private readonly iconsService = inject(IconsService);

  currentTheme: Theme = this.defaultConfigService.defaultTheme;
  availableThemes: { name: Theme, displayName: string }[] = [
    { name: 'deeppurple-amber', displayName: 'Deep Purple & Amber' },
    { name: 'indigo-pink', displayName: 'Indigo & Pink' },
    { name: 'pink-bluegrey', displayName: 'Pink & Blue-grey' },
    { name: 'purple-green', displayName: 'Purple & Green' },
  ];

  themeSelectionToolTip = $localize`Select a theme`;

  ngOnInit(): void {
    const theme = this.storageService.getItem<Theme>('navigation-theme') as Theme | null;

    if (theme) {
      this.currentTheme = theme;
      this.#addTheme(theme);
    }
  }

  getIcon(iconName: string) {
    return this.iconsService.getIcon(iconName);
  }

  updateTheme(themeName: Theme) {
    if(this.currentTheme) {
      this.#removeTheme(this.currentTheme);
    }

    if (themeName !== this.defaultConfigService.defaultTheme) {
      this.#addTheme(themeName);
      this.currentTheme = themeName;
    } else {
      this.currentTheme = this.defaultConfigService.defaultTheme;
    }

    this.storageService.setItem('navigation-theme', this.currentTheme);
  }

  #removeTheme(themeName: Theme) {
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

  #addTheme(themeName: Theme) {
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
