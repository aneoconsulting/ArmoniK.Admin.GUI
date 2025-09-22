import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Theme } from '@app/types/themes';
import { IconsService } from '@services/icons.service';
import { ThemeService } from '@services/theme.service';

@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrl: './navigation.component.scss',
  providers: [],
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
  ]
})
export class ThemeSelectorComponent {
  private readonly themeService = inject(ThemeService);
  private readonly iconsService = inject(IconsService);

  readonly availableThemes: { name: Theme, displayName: string }[] = [
    { name: 'dark-green', displayName: 'Dark Green' },
    { name: 'light-blue', displayName: 'Light Blue' },
    { name: 'light-pink', displayName: 'Light Pink' },
    { name: 'dark-purple', displayName: 'Dark Purple' },
  ];

  themeSelectionToolTip = $localize`Select a theme`;

  getIcon(iconName: string) {
    return this.iconsService.getIcon(iconName);
  }

  updateTheme(themeName: Theme) {
    this.themeService.changeTheme(themeName);
  }
}
