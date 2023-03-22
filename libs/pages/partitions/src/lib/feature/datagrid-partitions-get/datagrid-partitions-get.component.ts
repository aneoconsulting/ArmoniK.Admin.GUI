import { AsyncPipe, JsonPipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GrpcPartitionsService } from "@armonik.admin.gui/partitions/data-access";
import { ClrIconModule, ClrModalModule } from "@clr/angular";
import { Subject, map, merge, switchMap, tap } from "rxjs";

@Component({
  standalone: true,
  selector: 'armonik-admin-gui-datagrid-partitions-get',
  templateUrl: './datagrid-partitions-get.component.html',
  styleUrls: ['./datagrid-partitions-get.component.scss'],
  imports: [
    ClrIconModule,
    ClrModalModule,
    NgIf,
    AsyncPipe,
    JsonPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridPartitionsGetComponent implements OnChanges {
  @Input() open = false;
  @Input() partitionId = '';

  @Output() openChange = new EventEmitter<boolean>();
  @Output() partitionIdChange = new EventEmitter<string>();

  private _load = new Subject<void>()
  public loading = true;
  public get$ = merge(this._load).pipe(
    tap(() => console.log('get$')),
    tap(() => this.loading = true),
    switchMap(
      () => this._grpcPartitionsService.get$(this.partitionId).pipe(
        tap(() => this.loading = false),
        map((response) => response.partition)
      )
    )
  )


  constructor(private _grpcPartitionsService: GrpcPartitionsService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && changes['open'].currentValue === true) {
      this._load.next();
    }
  }

  public closeModal() {
    this.partitionIdChange.emit('');
    this.openChange.emit(false);
  }
}
