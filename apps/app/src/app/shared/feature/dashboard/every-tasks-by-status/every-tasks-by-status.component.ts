import { ChangeDetectionStrategy, Component } from "@angular/core";
import { GrpcTasksService } from "@armonik.admin.gui/tasks/data-access";
import { map, switchMap, timer } from "rxjs";
import { TasksByStatusComponent } from "../../../ui/";
import { AsyncPipe, NgIf } from "@angular/common";

@Component({
  standalone: true,
  selector: "app-every-tasks-by-status",
  templateUrl: "./every-tasks-by-status.component.html",
  styleUrls: ["./every-tasks-by-status.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TasksByStatusComponent, AsyncPipe, NgIf],
})
export class EveryTasksByStatusComponent {
  public load$ = timer(0, 2000).pipe(switchMap(() => this._grpcTasksService.countTasksByStatus$()), map((data) => {
    console.log(data);
    return data.status ?? [];
  }));

  constructor(
    private _grpcTasksService: GrpcTasksService
  ) { }

}
