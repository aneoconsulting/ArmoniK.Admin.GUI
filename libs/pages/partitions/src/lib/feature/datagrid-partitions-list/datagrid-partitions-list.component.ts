import { ListPartitionsRequest, PartitionRaw } from "@aneoconsultingfr/armonik.api.angular";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Params, RouterModule } from "@angular/router";
import { GrpcPartitionsService } from "@armonik.admin.gui/partitions/data-access";
import { DatagridService, DatagridStorageService, DatagridURLService, DatagridUtilsService, GrpcParamsService, StorageService, URLService } from "@armonik.admin.gui/shared/data-access";
import { ClrDatagridModule, ClrDatagridSortOrder, ClrDatagridStateInterface, ClrIconModule } from "@clr/angular";
import { Observable, Subject, catchError, merge, switchMap, tap } from "rxjs";
import { AutoRefreshButtonComponent } from "../../ui/auto-refresh-button/auto-refresh-button.component";
import { RefreshButtonComponent } from "../../ui/refresh-button/refresh-button.component";
import { ActionsDropdownComponent } from "../../ui/actions-dropdown/actions-dropdown.component";
import { IdFilterComponent } from "../../ui/id-filter/id-filter.component";
import { PartitionsService } from "../../data-access/partitions.service";

@Component({
  standalone: true,
  selector: 'armonik-admin-gui-datagrid-partitions-list',
  templateUrl: './datagrid-partitions-list.component.html',
  styleUrls: ['./datagrid-partitions-list.component.scss'],
  imports: [
    RouterModule,
    ClrIconModule,
    ClrDatagridModule,
    RefreshButtonComponent,
    AutoRefreshButtonComponent,
    ActionsDropdownComponent,
    IdFilterComponent,
    AsyncPipe, NgIf, NgForOf
  ],
  providers: [
    GrpcParamsService,
    GrpcPartitionsService,
    PartitionsService,
    StorageService,
    URLService,
    DatagridURLService,
    DatagridUtilsService,
    DatagridStorageService,
    DatagridService,
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
        // TODO: Catch error and show it in the UI
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

  constructor(private _partitionsListService: PartitionsService, private _urlService: URLService, private _datagridURLService: DatagridURLService, private _datagridStorageService: DatagridStorageService, private _datagridUtilsService: DatagridUtilsService, private _datagridService: DatagridService) { }

  public getQueryParamsPage$(): Observable<number> {
    return this._datagridURLService.getQueryParamsPage$();
  }

  public getQueryParamsPageSize$(): Observable<number> {
    return this._datagridURLService.getQueryParamsPageSize$();
  }

  public getQueryParamsOrderByColumn$(columnName: string): Observable<ClrDatagridSortOrder> {
    return this._datagridURLService.getQueryParamsOrderByColumn$(columnName);
  }

  public getQueryParamsFilterByColumn$(columnName: string): Observable<string> {
    return this._datagridURLService.getQueryParamsFilterByColumn$(columnName);
  }

  public onRefresh(state: ClrDatagridStateInterface) {
    this._updateState(state);

    const queryParams = this._datagridUtilsService.generateQueryParams(state);
    this.saveQueryParams('partitions',queryParams);
    this._urlService.updateQueryParams(queryParams);

    this.refresh$.next();
  }

  public onManualRefresh() {
    this.refresh$.next();
  }

  public onAutoRefresh() {
    this.refresh$.next();
  }

  public onIntervalChange(value: number | null) {
    this._datagridStorageService.saveCurrentInterval(value)
  }

  public restoreCurrentInterval() {
    return this._datagridStorageService.restoreCurrentInterval()
  }

  public onClearFilters() {
    this._datagridURLService.resetFilteringFromQueryParams();
    // Add it to a function in the datagrid service with a call to clear the url (2 in 1)
    this._state.filters = [];
    // Because of a bug, we need to refresh the datagrid manually
    this.refresh$.next();
  }

  public onClearSort() {
    this._datagridURLService.resetSortFromQueryParams();
    this._state.sort = {
      by: '',
      reverse: false,
    };
  }

  public saveQueryParams(name: string,params: Params) {
    this._datagridService.saveQueryParams(name, params);
  }

  public trackByPartition(_: number, item: PartitionRaw) {
    return item.id;
  }

  private _updateState(state: ClrDatagridStateInterface) {
    this._state = state;
  }
}
