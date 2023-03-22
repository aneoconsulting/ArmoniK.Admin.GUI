import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GrpcApplicationsService } from '@armonik.admin.gui/applications/data-access';
import { ClrButtonModule } from '@clr/angular';
import { Observable, map, switchMap, tap, timer } from 'rxjs';
import { ApplicationCardComponent } from '../../ui/application-card/application-card.component';
import { GrpcParamsService } from '@armonik.admin.gui/shared/data-access';
import {
  ApplicationRaw,
  ListApplicationsRequest,
  ListApplicationsResponse,
} from '@aneoconsultingfr/armonik.api.angular';

@Component({
  standalone: true,
  selector: 'armonik-admin-gui-dashboard-applications-list',
  templateUrl: './applications-list.component.html',
  styleUrls: ['./applications-list.component.scss'],
  imports: [
    NgIf,
    NgForOf,
    AsyncPipe,
    ClrButtonModule,
    ApplicationCardComponent,
  ],
  providers: [GrpcApplicationsService, GrpcParamsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationsListComponent {
  public total: number | null = null;

  public loadApplications$ = timer(0, 2000).pipe(
    switchMap(() => this._loadApplications$()),
    tap((data) => {
      this.total = data.total;
    }),
    map((data) => data.applications)
  );

  private _currentPage = 0;
  private _pageSize = 2;

  constructor(private _grpcApplicationsService: GrpcApplicationsService) {}

  public previousPage() {
    this._currentPage--;
  }

  public nextPage() {
    this._currentPage++;
  }

  public isFirstPage() {
    return this._currentPage === 0;
  }

  public isLastPage() {
    if (this.total === null || this.total === 0) {
      return true;
    }
    return this._currentPage === Math.round(this.total / this._pageSize) - 1;
  }

  public trackByApplication(_: number, application: ApplicationRaw) {
    return application.name + application.version;
  }

  private _loadApplications$(): Observable<ListApplicationsResponse> {
    const options = this._grpcApplicationsService.createListRequestOptions({
      page: this._currentPage,
      pageSize: this._pageSize,
      orderBy: [
        ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAME,
        ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_VERSION,
      ],
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
