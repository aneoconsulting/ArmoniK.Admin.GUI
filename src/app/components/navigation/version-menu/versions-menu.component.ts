import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { IconsService } from '@services/icons.service';
import { VersionsService } from '@services/versions.service';
import { RepositoryVersionComponent } from './repository-version.component';
import pkg from '../../../../../package.json';

@Component({
  selector: 'app-versions-menu',
  templateUrl: 'versions-menu.component.html',
  standalone: true,
  imports: [
    MatMenuModule,
    MatIconModule,
    RepositoryVersionComponent,
    MatButtonModule,
  ]
})
export class VersionsMenuComponent {
  private readonly versionsService = inject(VersionsService);
  private readonly iconsService = inject(IconsService);

  readonly version = this.getVersion();

  readonly repositories = [
    {
      label: 'API',
      link: 'https://github.com/aneoconsulting/ArmoniK.Api/releases/',
      version: this.versionsService.api,
      icon: 'api'
    },
    {
      label: 'Core',
      link: 'https://github.com/aneoconsulting/ArmoniK.Core/releases/',
      version: this.versionsService.core,
      icon: 'hub'
    }
  ];

  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }

  getVersion() {
    return process.env['NODE_ENV'] === 'development' ? '-dev' : pkg.version;
  }
}