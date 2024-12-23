import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import { IconsService } from '../services/icons.service';
import { Status } from '@app/types/data';

@Component({
  selector: 'app-status-chip',
  templateUrl: 'status-chip.component.html',
  styleUrl: 'status-chip.component.css',
  standalone: true,
  imports: [
    MatChipsModule,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusChipComponent<S extends Status> {
  private readonly iconsService = inject(IconsService);

  @Input({ required: false }) statusService: AbstactStatusService<S> | undefined;

  @Input({ required: false }) set status(entry: S) {
    if (this.statusService) {
      const { label, color, icon } = this.statusService.getAll(entry);
      this.label = label ?? 'Unknown';
      this.color = color ?? 'grey';
      this.icon = this.iconsService.getIcon(icon);
    }
  }

  @Input({ required: false }) set statusLabelColor(entry: StatusLabelColor) {
    this.label = entry.label;
    this.color = entry.color;
    this.icon = this.iconsService.getIcon(entry.icon);
  }

  label: string = '-';
  color: string = 'grey';
  icon: string | undefined = this.iconsService.getIcon('unspecified');
}