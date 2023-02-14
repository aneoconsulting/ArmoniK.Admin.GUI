import { ChangeDetectionStrategy, Component } from "@angular/core";
import { GrpcApplicationsService } from "@armonik.admin.gui/applications/data-access";
import { ApplicationRaw, ListApplicationsRequest, ListApplicationsResponse } from "@armonik.admin.gui/shared/data-access";
import { Observable, switchMap, timer, map } from "rxjs";

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
  public loadApplications$ = timer(0, 2000).pipe(switchMap(() => this._loadApplications())).pipe(map((data) => {
    const sortedApplications = data.applications?.sort((applicationA, applicationB) => {
      const idA = `${applicationA.name}${applicationA.version}`
      const idB = `${applicationB.name}${applicationB.version}`

      if (idA < idB) {
        return -1;
      }
      if (idA > idB) {
        return 1;
      }

      return 0;
    });

    return sortedApplications ?? [];
  }));

  constructor(
    private _grpcApplicationsService: GrpcApplicationsService,
  ) { }

  public trackApplication(_: number, item: ApplicationRaw): string {
    return item.name + item.version;
  }

  private _loadApplications(): Observable<ListApplicationsResponse> {
    return this._grpcApplicationsService.list$(this._loadApplicationsOptions);
  }

}
