import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { JsonComponent } from './json.component';

@Component({
  selector: 'app-json-inspection',
  templateUrl: 'inspection-json.component.html',
  standalone: true,
  providers: [
    IconsService,
  ],
  imports: [
    JsonComponent,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule
  ],
  styles: [`
  app-json {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .mat-expansion-panel-body {
    padding: 0;
  }
  `]
})
export class InspectionJsonComponent {
  @Input({ required: true }) data: object | null;

  readonly iconsService = inject(IconsService);
  readonly clipboard = inject(Clipboard);
  readonly notificationService = inject(NotificationService);

  readonly copyIcon = this.iconsService.getIcon('copy');

  copy() {
    try {
      const object = JSON.stringify(this.data, null, 2);
      this.clipboard.copy(object);
      this.notificationService.success('Value copied to clipboard');
    } catch (e) {
      console.error(e);
      this.notificationService.error('Could not copy value');
    }
  }
}