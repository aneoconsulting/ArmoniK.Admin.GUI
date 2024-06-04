import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApplicationData, PartitionData, ResultData, SessionData, TaskData } from '@app/types/data';
import { ActionTable } from '@app/types/table';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-table-actions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table-actions.component.html',
  styles: [`
    p {
      margin: 0;
    }
  `],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    NgIf,
    NgFor,
    MatMenuModule
  ]
})
export class TableActionsComponent<T extends ApplicationData | SessionData | PartitionData | TaskData | ResultData> {
  @Input() actions: ActionTable<T>[] = [];
  @Input() element: T;

  readonly iconsService = inject(IconsService);

  getIcon(icon: string): string {
    return this.iconsService.getIcon(icon);
  }
}