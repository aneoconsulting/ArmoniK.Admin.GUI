import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { StorageService } from '@services/storage.service';

@Component({
  selector: 'app-change-language-button',
  standalone: true,
  templateUrl: './change-language-button.component.html',
  imports: [
    RouterModule,
    MatMenuModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class ChangeLanguageButtonComponent implements OnInit {
  private readonly defaultConfigService = inject(DefaultConfigService);
  private readonly router = inject(Router);
  private readonly iconsService = inject(IconsService);
  private readonly storageService = inject(StorageService);

  selectedLanguage: string;
  availableLanguages: string[];
  languageButtonTip = $localize`Change language`;

  ngOnInit(): void {
    this.selectedLanguage = this.defaultConfigService.defaultLanguage;
    this.availableLanguages = this.defaultConfigService.availableLanguages.filter(language => language !== this.selectedLanguage);
  }
  
  getLanguageFromUrl(): string | undefined {
    const location = window.location.pathname.split('/');
    let urlLanguage: undefined | string = undefined;
    let i = 0;
    while (i < this.defaultConfigService.availableLanguages.length && !urlLanguage) {
      const language = this.defaultConfigService.availableLanguages[i];
      urlLanguage = location.find(path => path === language);
      i++;
    }
    return urlLanguage;
  }

  setLanguage(language: string) {
    this.storageService.setItem('language', language);
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  getRoute() {
    return this.router.url;
  }
}