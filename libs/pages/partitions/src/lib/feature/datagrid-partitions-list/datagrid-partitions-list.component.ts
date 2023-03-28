import { ListPartitionsRequest, PartitionRaw } from "@aneoconsultingfr/armonik.api.angular";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GrpcPartitionsService } from "@armonik.admin.gui/partitions/data-access";
import { GrpcParamsService } from "@armonik.admin.gui/shared/data-access";
import { ClrDatagridModule, ClrDatagridSortOrder, ClrDatagridStateInterface, ClrIconModule } from "@clr/angular";
import { Observable, Subject, catchError, merge, switchMap, tap } from "rxjs";
import { DatagridService } from "../../data-access/datagrid.service";
import { PartitionsService } from "../../data-access/partitions.service";
import { UrlService } from "../../data-access/url.service";

@Component({
  standalone: true,
  selector: 'armonik-admin-gui-datagrid-partitions-list',
  templateUrl: './datagrid-partitions-list.component.html',
  styleUrls: ['./datagrid-partitions-list.component.scss'],
  imports: [
    RouterModule,
    ClrIconModule,
    ClrDatagridModule,
    AsyncPipe, NgIf, NgForOf
  ],
  providers: [
    GrpcParamsService,
    GrpcPartitionsService,
    PartitionsService,
    DatagridService,
    UrlService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridPartitionsListComponent {
  public fields = {
    id: ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_ID.toString(),
    priority: ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_PRIORITY.toString(),
  } as const

  private _state: ClrDatagridStateInterface = {};

  public total = 0;
  public loading = true;
  public lastError: string | null = null;

  public refresh$ = new Subject<void>();

  public list$ = merge(
    this.refresh$,
  ).pipe(
    tap(() => {
      this.loading = true
      this.lastError = null
    }),
    switchMap(() => {
      return this._partitionsListService.list$(this._state).pipe(
        catchError((error) => {
          this.loading = false;
          this.lastError = error.message
          console.error(error);
          return [];
        }),
      )
    }
    ),
    tap((data) => {
      this.loading = false;
      this.total = data.total;
    }),
  )

  constructor(private _partitionsListService: PartitionsService, private _urlService: UrlService, private _datagridService: DatagridService) { }

  public getQueryParamsPage$(): Observable<number> {
    return this._datagridService.getQueryParamsPage$();
  }

  public getQueryParamsPageSize$(): Observable<number> {
    return this._datagridService.getQueryParamsPageSize$();
  }

  public getQueryParamsOrderByColumn$(columnName: string): Observable<ClrDatagridSortOrder> {
    return this._datagridService.getQueryParamsOrderByColumn$(columnName);
  }

  public onRefresh(state: ClrDatagridStateInterface) {
    this._updateState(state);

    const queryParams = this._datagridService.generateQueryParams(state);
    this._urlService.updateQueryParams(queryParams);

    this.refresh$.next();
  }

  public trackByPartition(_: number, item: PartitionRaw) {
    return item.id;
  }

  private _updateState(state: ClrDatagridStateInterface) {
    this._state = state;
  }
}
