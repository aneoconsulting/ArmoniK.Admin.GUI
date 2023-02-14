import { ChangeDetectionStrategy, Component } from "@angular/core";
import { GrpcApplicationsService } from "@armonik.admin.gui/applications/data-access";
import { ApplicationRaw, ListApplicationsRequest, ListApplicationsResponse } from "@armonik.admin.gui/shared/data-access";
import { Observable, switchMap, timer } from "rxjs";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private _loadApplicationsOptions = this._grpcApplicationsService.createListRequestOptions({
    page: 0,
    pageSize: 10,
    orderBy: ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAME,
    order: ListApplicationsRequest.OrderDirection.ORDER_DIRECTION_ASC,
    filter: {
      name: "",
      version: "",
      service: "",
      namespace: "",
    },
  });
  public loadApplications$ = timer(0, 2000).pipe(switchMap(() => this._loadApplications()));

  constructor(
    private _grpcApplicationsService: GrpcApplicationsService,
  ) { }

  public trackApplication(index: number, item: ApplicationRaw): string {
    return item.name + item.version;
  }

  private _loadApplications(): Observable<ListApplicationsResponse> {
    return this._grpcApplicationsService.list$(this._loadApplicationsOptions);
  }

}
