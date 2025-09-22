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

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    const appliedTheme = (this.storageService.getItem<Theme>('navigation-theme', true) as Theme);
    if (appliedTheme && isTheme(appliedTheme)) {
      this.applyTheme(appliedTheme);
    } else {
      this.applyTheme(this.defaultConfigService.defaultTheme);
    }
  }

  changeTheme(theme: Theme) {
    if (isTheme(theme)) {
      this.storeTheme(theme);
      this.applyTheme(theme);
    }
  }

  private applyTheme(theme: Theme) {
    ALL_THEMES.forEach(theme => this.renderer.removeClass(document.body, theme));
    this.renderer.addClass(document.body, theme);
  }

  private storeTheme(theme: Theme) {
    this.storageService.setItem('navigation-theme', theme);
  }
}