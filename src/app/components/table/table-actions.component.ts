import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskOptions } from '@app/tasks/types';
import { GrpcAction } from '@app/types/actions.type';
import { ArmonikData, DataRaw } from '@app/types/data';
import { IconsService } from '@services/icons.service';

/**
 * Displays all provided GrpcActions on each table line.
 * The actions are displayed in a menu appearing when clicking on the main button.
 * If there is only one provided action, will display directly the action.
 */
@Component({
  selector: 'app-table-actions',
  templateUrl: './table-actions.component.html',
  styleUrl: 'table-actions.component.scss',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule
  ]
})
export class TableActionsComponent<T extends DataRaw, O extends TaskOptions | null = null> {
  /**
   * Required input. Displayed actions.
   */
  @Input({ required: true }) actions: GrpcAction<T>[] = [];
  
  /**
   * Required input. Actions will be made using this ArmonikData.
   */
  @Input({ required: true }) element: ArmonikData<T, O>;

  private readonly iconsService = inject(IconsService);

  /**
   * Retrieves a material icon with its armonik name.
   * @param icon string - armonik name of the icon
   * @returns string - material name of the icon.
   */
  getIcon(icon: string): string {
    return this.iconsService.getIcon(icon);
  }
}