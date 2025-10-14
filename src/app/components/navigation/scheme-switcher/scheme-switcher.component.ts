import { Component, ElementRef, inject, OnInit } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColorScheme, isColorTheme } from '@app/types/themes';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { StorageService } from '@services/storage.service';

@Component({
  selector: 'app-scheme-switcher',
  templateUrl: 'scheme-switcher.component.html',
  styleUrl: 'scheme-switcher.component.scss',
  imports: [
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
  ],
})
export class SchemeSwitcherComponent implements OnInit {
  private readonly iconsService = inject(IconsService);
  private readonly storageService = inject(StorageService);
  private readonly defaultConfigService = inject(DefaultConfigService);
  private readonly elementRef = inject(ElementRef);

  currentScheme: ColorScheme;

  ngOnInit(): void {
    this.currentScheme = this.storageService.getItem('navigation-color-scheme') as ColorScheme ?? this.defaultConfigService.defaultColorScheme;
    this.setSchemeStyle(this.currentScheme);
  }

  private setSchemeStyle(scheme: ColorScheme) {
    this.elementRef.nativeElement.ownerDocument.documentElement.style['color-scheme'] = scheme;
  }

  selectScheme(scheme: ColorScheme) {
    if (scheme && isColorTheme(scheme)) {
      this.currentScheme = scheme;
      this.storageService.setItem('navigation-color-scheme', scheme);
      this.setSchemeStyle(this.currentScheme);
    }
  }

  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }
}