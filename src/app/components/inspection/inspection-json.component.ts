import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { JsonComponent } from './json.component';

@Component({
  selector: 'app-json-inspection',
  templateUrl: 'inspection-json.component.html',
  styleUrl: 'inspection-json.component.css',
  providers: [
    IconsService,
  ],
  imports: [
    JsonComponent,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatTooltipModule,
  ],
})
export class InspectionJsonComponent {
  @Input({ required: true }) data: object | null;

  display = false;

  readonly iconsService = inject(IconsService);
  readonly clipboard = inject(Clipboard);
  readonly notificationService = inject(NotificationService);

  readonly copyIcon = this.iconsService.getIcon('copy');
  readonly arrowDownIcon = this.iconsService.getIcon('arrow-down');
  readonly arrowUpIcon = this.iconsService.getIcon('arrow-up');

  readonly displayToolTip = $localize`Display JSON`;
  readonly hideToolTip = $localize`Hide JSON`;

  copy() {
    try {
      const object = JSON.stringify(this.data, null, 2);
      this.clipboard.copy(object);
      this.notificationService.success('JSON copied to clipboard');
    } catch (e) {
      console.error(e);
      this.notificationService.error('Could not copy JSON');
    }
  }

  toggleDisplay() {
    this.display = !this.display;
  }
}