import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import { StatusLabelColor } from '@app/types/status';
import { IconsService } from '../services/icons.service';

@Component({
  selector: 'app-status-chip',
  templateUrl: 'status-chip.component.html',
  styleUrl: 'status-chip.component.css',
  imports: [
    MatChipsModule,
    MatIconModule,
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusChipComponent {
  private readonly iconsService = inject(IconsService);

  @Input({ required: false }) set status(entry: StatusLabelColor) {
    this.label = entry.label ?? 'Unknown';
    this.color = entry.color ?? 'grey';
    this.icon = entry.icon !== undefined && entry.icon.length !== 1 ? this.iconsService.getIcon(entry.icon) : undefined;
  }

  label: string = '-';
  color: string = 'grey';
  icon: string | undefined = undefined;
}