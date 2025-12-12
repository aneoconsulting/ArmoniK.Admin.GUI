import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Theme } from '@app/types/themes';
import { PageSectionHeaderComponent } from '@components/page-section-header.component';
import { IconsService } from '@services/icons.service';
import { ThemeService } from '@services/theme.service';

@Component({
  selector: 'app-theme-selector',
  templateUrl: 'theme-selector.component.html',
  styleUrl: 'theme-selector.component.scss',
  imports: [
    PageSectionHeaderComponent,
    MatIconModule,
    MatButtonModule,
    CommonModule,
  ]
})
export class ThemeSelectorComponent {
  readonly themeService = inject(ThemeService);
  private readonly iconsService = inject(IconsService);

  readonly availableThemes: { name: Theme, displayName: string }[] = [
    { name: 'light-blue', displayName: $localize`Light Blue` },
    { name: 'light-pink', displayName: $localize`Light Pink` },
    { name: 'dark-green', displayName: $localize`Dark Green` },
    { name: 'dark-purple', displayName: $localize`Dark Purple` },
  ];

  getIcon(iconName: string) {
    return this.iconsService.getIcon(iconName);
  }

  updateTheme(themeName: Theme) {
    this.themeService.changeTheme(themeName);
  }
}
