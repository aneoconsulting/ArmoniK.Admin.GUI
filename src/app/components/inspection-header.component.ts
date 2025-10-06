import { CdkCopyToClipboard, Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StatusLabelColor } from '@app/types/status';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { PageHeaderComponent } from './page-header.component';
import { StatusChipComponent } from './status-chip.component';

@Component({
  selector: 'app-inspection-header',
  templateUrl: 'inspection-header.component.html',
  styleUrl: 'inspection-header.component.scss',
  imports: [
    MatToolbarModule,
    PageHeaderComponent,
    MatButtonModule,
    MatIconModule,
    CdkCopyToClipboard,
    MatTooltipModule,
    MatChipsModule,
    StatusChipComponent,
  ],
  providers: [
    IconsService,
    Clipboard,
    NotificationService,
  ],
})
export class InspectionHeaderComponent {
  private readonly iconsService = inject(IconsService);
  private readonly copyService = inject(Clipboard);
  private readonly notificationService = inject(NotificationService);

  private _id = '';
  
  @Input({ required: true }) set id(entry: string | null) {
    if (entry) {
      this._id = entry;
    }
  }

  @Input({ required: false }) status: StatusLabelColor | undefined;
  @Input({ required: false }) sharableURL: string | null;

  get id() {
    return this._id;
  }

  getIcon(name: string | undefined) {
    return name ? this.iconsService.getIcon(name) : '';
  }

  onCopyId() {
    this.copyService.copy(this._id);
    this.notificationService.success($localize`Id copy to Clipboard`);
  }
}