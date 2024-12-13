import { Component, Input, Signal, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-repository-version',
  standalone: true,
  templateUrl: 'repository-version.component.html',
  imports: [
    MatMenuModule,
    MatIconModule,
  ]
})
export class RepositoryVersionComponent {
  private readonly iconsService = inject(IconsService);

  @Input({ required: true }) label: string;
  @Input({ required: true }) link: string;
  @Input({ required: true }) version: Signal<string | undefined>;
  @Input({ required: true }) set icon(entry: string) {
    this.realIcon = this.iconsService.getIcon(entry);
  }

  realIcon: string;
}