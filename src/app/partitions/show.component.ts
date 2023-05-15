import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { AppShowComponent } from '@app/types/components';
import { ShowPageComponent } from '@components/show-page.component';
import { UtilsService } from '@services/utils.service';
import { PartitionsGrpcService } from './services/partitions-grpc.service';
import { PartitionRaw } from './types';

@Component({
  selector: 'app-partitions-show',
  template: `
<!-- TODO: Create a function to generate sharable URL -->
<app-show-page [id]="data?.id ?? null" [data]="data" [sharableURL]="'hello'"></app-show-page>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [
    UtilsService,
    PartitionsGrpcService
  ],
  imports: [
    ShowPageComponent
  ]
})
export class ShowComponent implements AppShowComponent<PartitionRaw>, AfterViewInit {
  data: PartitionRaw | null = null;

  constructor(
    private _route: ActivatedRoute,
    private _partitionsGrpcService: PartitionsGrpcService,
  ) {}

  ngAfterViewInit(): void {
    this._route.params.pipe(
      map(params => params['id']),
      switchMap((id) => {
        return this._partitionsGrpcService.get$(id);
      }),
      map((data) => {
        return data.partition ?? null;
      })
    )
      .subscribe((data) => this.data = data);
  }
}
