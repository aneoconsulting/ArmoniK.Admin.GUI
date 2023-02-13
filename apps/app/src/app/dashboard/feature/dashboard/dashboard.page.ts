import { ChangeDetectionStrategy, Component } from "@angular/core";
import { GrpcApplicationsService } from "@armonik.admin.gui/applications/data-access";
import { ListApplicationsRequest } from "@armonik.admin.gui/shared/data-access";

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
  public loadApplications$ = this._grpcApplicationsService.list$(this._loadApplicationsOptions);

  constructor(
    private _grpcApplicationsService: GrpcApplicationsService,
  ) { }


}
