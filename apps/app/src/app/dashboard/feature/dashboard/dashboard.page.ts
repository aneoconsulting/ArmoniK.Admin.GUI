import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GrpcApplicationsService } from '@armonik.admin.gui/applications/data-access';
import {
  ApplicationRaw,
  ListApplicationsRequest,
  ListApplicationsResponse,
} from '@armonik.admin.gui/shared/data-access';
import { Observable, Subject, map, merge, switchMap, tap, timer } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  public totalTasks = 0;

  public total = 0;
  private _pageSize = 2;
  private _currentPage = 0;
  private _loadApplicationsSubject = new Subject<void>();

  public loadApplications$ = merge(
    timer(0, 2000),
    this._loadApplicationsSubject
  ).pipe(
    switchMap(() => this._loadApplications()),
    tap((data) => {
      this.total = data.total;
    }),
    map((data) => data.applications)
  );

  constructor(private _grpcApplicationsService: GrpcApplicationsService) { }

  public isFirstPage() {
    return this._currentPage === 0;
  }

  public isLastPage() {
    return this._currentPage === this.total / this._pageSize - 1;
  }

  public previousPage() {
    this._currentPage--;
    this._loadApplicationsSubject.next();
  }

  public nextPage() {
    this._currentPage++;
    this._loadApplicationsSubject.next();
  }

  public getTotalTasks(total: number) {
    this.totalTasks = total;
  }

  public trackApplication(_: number, item: ApplicationRaw): string {
    return item.name + item.version;
  }

  private _loadApplications(): Observable<ListApplicationsResponse> {
    const options = this._grpcApplicationsService.createListRequestOptions({
      page: this._currentPage,
      pageSize: this._pageSize,
      orderBy: [ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAME, ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_VERSION],
      order: ListApplicationsRequest.OrderDirection.ORDER_DIRECTION_ASC,
      filter: {
        name: '',
        version: '',
        service: '',
        namespace: '',
      },
    });

    return this._grpcApplicationsService.list$(options);
  }
}
