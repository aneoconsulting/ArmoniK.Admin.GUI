import { AsyncPipe, JsonPipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { ReplaySubject, Subscription, catchError, map, mapTo, of, publishReplay, share, startWith, switchMap, tap } from "rxjs";
import { PartitionsService } from "../../data-access/partitions.service";
import { GrpcPartitionsService } from "@armonik.admin.gui/partitions/data-access";
import { GrpcParamsService } from "@armonik.admin.gui/shared/data-access";
import { ClrAlertModule } from "@clr/angular";

@Component({
  standalone: true,
  selector: 'armonik-admin-gui-partition-get',
  templateUrl: './page-partition-get-feature.component.html',
  styleUrls: ['./page-partition-get-feature.component.scss'],
  imports: [RouterModule, ClrAlertModule, AsyncPipe, JsonPipe, NgIf],
  providers: [PartitionsService, GrpcPartitionsService, GrpcParamsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartitionGetComponent {
  public partitionId = '';


  public readonly content$ = this._activatedRoute.params.pipe(
    map((params) => params['partitionId']),
    switchMap((partitionId) => this._partitionsService.get$(partitionId)
    ),
    tap((partition) => this.partitionId = partition.partition?.id ?? ''),
    share({
      connector: () => new ReplaySubject(1),
      resetOnComplete: false,
      resetOnError: false,
      resetOnRefCountZero: false
    })
  )

  public readonly isLoading$ = this.content$.pipe(
    map(() => false),
    catchError(() => of(false)),
    startWith(true),
  )

  public readonly error$ = this.content$.pipe(
    map(() => null),
    catchError((error) => {
      return of(error);
    })
  )

  constructor(private _activatedRoute: ActivatedRoute, private _partitionsService: PartitionsService) { }
}
