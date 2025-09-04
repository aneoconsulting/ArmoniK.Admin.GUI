import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataRaw } from '@app/types/data';
import { GrpcActionsService } from '@app/types/services/grpc-actions.service';
import { IconsService } from '@services/icons.service';
import { Subject } from 'rxjs';

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

  @Input({ required: true }) set refresh$(entry: Subject<void>) {
    this.grpcActionsService.refresh = entry;
  }
  @Input({ required: true }) selection: T[];

  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }
}