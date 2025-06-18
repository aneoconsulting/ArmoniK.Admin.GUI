import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskOptions } from '@app/tasks/types';
import { ArmonikData, DataRaw } from '@app/types/data';
import { ActionTable } from '@app/types/table';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-table-actions',
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
    MatMenuModule
  ]
})
export class TableActionsComponent<T extends DataRaw, O extends TaskOptions | null = null> {
  @Input() actions: ActionTable<T, O>[] = [];
  @Input() element: ArmonikData<T, O>;

  readonly iconsService = inject(IconsService);

  getIcon(icon: string): string {
    return this.iconsService.getIcon(icon);
  }
}