import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { GrpcTasksService } from '@armonik.admin.gui/tasks/data-access';
import { map, switchMap, tap, timer } from 'rxjs';
import { TasksByStatusComponent } from '../../../ui/';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-every-tasks-by-status',
  templateUrl: './every-tasks-by-status.component.html',
  styleUrls: ['./every-tasks-by-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TasksByStatusComponent, AsyncPipe, NgIf],
})
export class EveryTasksByStatusComponent {
  @Output() total = new EventEmitter<number>();

  public load$ = timer(0, 2000).pipe(
    switchMap(() => this._grpcTasksService.countTasksByStatus$()),
    tap((data) => {
      const total =
        data.status?.reduce((acc, item) => acc + item.count, 0) ?? 0;
      this.total.emit(total);
    }),
    map((data) => {
      return data.status ?? [];
    })
  );

  constructor(private _grpcTasksService: GrpcTasksService) {}
}
