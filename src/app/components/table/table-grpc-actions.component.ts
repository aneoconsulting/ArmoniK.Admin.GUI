import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataRaw } from '@app/types/data';
import { GrpcActionsService } from '@app/types/services/grpc-actions.service';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-table-grpc-actions',
  templateUrl: 'table-grpc-actions.component.html',
  styleUrl: 'table-grpc-actions.component.css',
  imports: [
    MatButtonModule,
    MatIconModule,
  ]
})
export class TableGrpcActionsComponent<T extends DataRaw> {
  readonly grpcActionsService = inject(GrpcActionsService);
  private readonly iconsService = inject(IconsService);

  @Input({ required: true }) selection: T[];

  @Input({ required: true }) selectDisplayed: boolean;

  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }
}