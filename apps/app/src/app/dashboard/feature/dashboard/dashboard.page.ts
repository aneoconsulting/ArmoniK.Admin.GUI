import { ChangeDetectionStrategy, Component } from "@angular/core";
import { GrpcApplicationsService } from "@armonik.admin.gui/applications/data-access";
import { ApplicationRaw, ListApplicationsRequest, ListApplicationsResponse } from "@armonik.admin.gui/shared/data-access";
import { Observable, switchMap, timer, map, Subject, merge, tap } from "rxjs";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private _currentPage = 0;
  private _loadApplicationsSubject = new Subject<void>();

  public loadApplications$ = merge(timer(0, 2000), this._loadApplicationsSubject).pipe(switchMap(() => this._loadApplications()), map((data) => {
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

  public nextPage() {
    this._currentPage++;
    this._loadApplicationsSubject.next();
  }

  public trackApplication(_: number, item: ApplicationRaw): string {
    return item.name + item.version;
  }

  private _loadApplications(): Observable<ListApplicationsResponse> {
    const options = this._grpcApplicationsService.createListRequestOptions({
      page: this._currentPage,
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

    return this._grpcApplicationsService.list$(options);
  }

}
