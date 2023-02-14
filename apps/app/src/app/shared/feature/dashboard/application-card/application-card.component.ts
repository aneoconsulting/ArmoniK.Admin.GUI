import { AsyncPipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { GrpcApplicationsService } from "@armonik.admin.gui/applications/data-access";
import { ApplicationRaw, CountTasksByStatusApplicationResponse } from "@armonik.admin.gui/shared/data-access";
import { Observable, map, switchMap, timer } from "rxjs";
import { TasksByStatusComponent } from "../../../ui";

@Component({
  standalone: true,
  selector: "app-application-card",
  templateUrl: "./application-card.component.html",
  styleUrls: ["./application-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TasksByStatusComponent, AsyncPipe, NgIf],
})
export class ApplicationCardComponent {
  @Input() application: ApplicationRaw;

  public loadCountTasksByStatus$ = timer(0, 2000).pipe(switchMap(() => this._countTasksByStatus$()), map((data) => {
    return data.status ?? [];
  }));

  constructor(
    private _grpcApplicationsService: GrpcApplicationsService,
  ) {
  }

  private _countTasksByStatus$(): Observable<CountTasksByStatusApplicationResponse> {
    const params = { name: this.application.name, version: this.application.version };

    return this._grpcApplicationsService.countTasksByStatus$(params)
  }
}
