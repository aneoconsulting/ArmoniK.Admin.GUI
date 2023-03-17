import { PartitionRaw } from "@aneoconsultingfr/armonik.api.angular";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { GrpcPartitionsService } from "@armonik.admin.gui/partitions/data-access";
import { GrpcParamsService } from "@armonik.admin.gui/shared/data-access";
import { ClrDatagridModule, ClrDatagridSortOrder, ClrDatagridStateInterface, ClrIconModule } from "@clr/angular";
import { Subject, merge, switchMap, tap } from "rxjs";
import { DatagridService } from "../../data-access/datagrid.service";
import { PartitionsListService } from "../../data-access/partitions-list.service";
import { UrlService } from "../../data-access/url.service";
import { DatagridPartitionsGetComponent } from "../datagrid-partitions-get/datagrid-partitions-get.component";

@Component({
  standalone: true,
  selector: 'armonik-admin-gui-datagrid-partitions-list',
  templateUrl: './datagrid-partitions-list.component.html',
  styleUrls: ['./datagrid-partitions-list.component.scss'],
  imports: [
    ClrDatagridModule,
    DatagridPartitionsGetComponent,
    AsyncPipe, NgIf, NgForOf
  ],
  providers: [
    GrpcParamsService,
    GrpcPartitionsService,
    PartitionsListService,
    DatagridService,
    UrlService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridPartitionsListComponent {
  private _state: ClrDatagridStateInterface = {};

  public total = 0;
  public loading = true;

  public refresh$ = new Subject<void>();

  public list$ = merge(
    this.refresh$,
  ).pipe(
    tap(() => this.loading = true),
    switchMap(() => this._partitionsListService.list$({}).pipe(
      tap((data) => {
        this.loading = false;
        this.total = data.total;
      }))
    )
  )

  constructor(private _partitionsListService: PartitionsListService, private _urlService: UrlService, private _datagridService: DatagridService) { }

  public getQueryParamsPage(): number {
    return this._datagridService.getQueryParamsPage();
  }

  public getQueryParamsPageSize(): number {
    return this._datagridService.getQueryParamsPageSize();
  }

  public getQueryParamsOrderByColumn(columnName: string): ClrDatagridSortOrder {
    return this._datagridService.getQueryParamsOrderByColumn(columnName);
  }

  public onRefresh(state: ClrDatagridStateInterface) {
    console.log('onRefresh', state);
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
