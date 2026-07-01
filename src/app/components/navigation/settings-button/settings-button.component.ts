import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { rotateFull } from '@app/shared/animations';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-settings-button',
  templateUrl: 'settings-button.component.html',
  styleUrl: 'settings-button.component.scss',
  imports: [
    MatButtonModule,
    RouterModule,
    MatIconModule,
  ],
  animations: [
    rotateFull,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsButtonComponent {
  readonly icon: string;

  readonly isHovered = signal(false);

  constructor(iconsService: IconsService) {
    this.icon = iconsService.getIcon('settings');
  }

  @HostListener('mouseenter')
  mouseEnterListener(): void {
    this.isHovered.set(true);
  }

  @HostListener('mouseleave')
  mouseLeaveListener(): void {
    this.isHovered.set(false);
  }
}