import { inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ALL_THEMES, isTheme, Theme } from '@app/types/themes';
import { DefaultConfigService } from './default-config.service';
import { StorageService } from './storage.service';

@Injectable()
export class ThemeService {
  private readonly defaultConfigService = inject(DefaultConfigService);
  private readonly storageService = inject(StorageService);
  private readonly rendererFactory = inject(RendererFactory2);
  private readonly renderer: Renderer2;

  private currentTheme: Theme; 

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.initTheme();
  }

  private initTheme() {
    const appliedTheme = (this.storageService.getItem<Theme>('navigation-theme', true) as Theme);
    if (appliedTheme && isTheme(appliedTheme)) {
      this.applyTheme(appliedTheme);
    } else {
      this.applyTheme(this.defaultConfigService.defaultTheme);
    }
  }

  changeTheme(theme: Theme) {
    if (theme && isTheme(theme)) {
      this.storeTheme(theme);
      this.applyTheme(theme);
    }
  }

  private applyTheme(theme: Theme) {
    if (theme !== this.currentTheme) {
      ALL_THEMES.forEach(themeToRemove => {
        if (theme !== themeToRemove) {
          this.renderer.removeClass(document.body, themeToRemove);
        }
      });
      this.renderer.addClass(document.body, theme);
      this.currentTheme = theme;
    }
  }

  private storeTheme(theme: Theme) {
    this.storageService.setItem('navigation-theme', theme);
  }
}