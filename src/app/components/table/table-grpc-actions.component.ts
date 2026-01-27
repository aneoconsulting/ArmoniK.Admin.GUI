import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataRaw } from '@app/types/data';
import { GrpcActionsService } from '@app/types/services/grpc-actions.service';
import { IconsService } from '@services/icons.service';
import { Subject } from 'rxjs';

/**
 * Displays all availables grpc actions for selected rows.
 * Displayed on the table header.
 */
@Component({
  selector: 'app-table-grpc-actions',
  templateUrl: 'table-grpc-actions.component.html',
  styleUrl: 'table-grpc-actions.component.scss',
  imports: [
    MatButtonModule,
    MatIconModule,
  ]
})
export class TableGrpcActionsComponent<T extends DataRaw> {
  /**
   * Provided GrpcActionService.
   */
  readonly grpcActionsService = inject(GrpcActionsService);
  private readonly iconsService = inject(IconsService);

  /**
   * Refresh subject of the table. Used by the grpcActionService to refresh the data when the grpc action is done.
   */
  @Input({ required: true }) set refresh$(entry: Subject<void>) {
    this.grpcActionsService.refresh = entry;
  }

  /**
   * Current selection from the user. Actions will be using this array.
   */
  @Input({ required: true }) selection: T[];

  /**
   * Checks if the select column is displayed. If not, will not display anything.
   */
  @Input({ required: true }) selectDisplayed: boolean;

  /**
   * Retrieves a material icon with its armonik name.
   * @param icon string - armonik name of the icon
   * @returns string - material name of the icon.
   */
  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }
}