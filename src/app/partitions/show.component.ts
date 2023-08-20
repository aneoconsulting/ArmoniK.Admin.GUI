import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { AppShowComponent } from '@app/types/components';
import { Page } from '@app/types/pages';
import { ShowPageComponent } from '@components/show-page.component';
import { IconsService } from '@services/icons.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { PartitionsGrpcService } from './services/partitions-grpc.service';
import { PartitionsIndexService } from './services/partitions-index.service';
import { PartitionRaw } from './types';

@Component({
  selector: 'app-partitions-show',
  template: `
<app-show-page [id]="data?.id ?? null" [data]="data" [sharableURL]="sharableURL">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getPageIcon('partitions')"></mat-icon>
  <span i18n="Page title">Partition</span>
</app-show-page>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [
    UtilsService,
    ShareUrlService,
    QueryParamsService,
    PartitionsGrpcService,
    PartitionsIndexService,
    TableService,
    TableURLService,
    TableStorageService,
  ],
  imports: [
    ShowPageComponent,
    MatIconModule
  ]
})
export class ShowComponent implements AppShowComponent<PartitionRaw>, OnInit, AfterViewInit {
  sharableURL = '';
  data: PartitionRaw | null = null;

  #iconsService = inject(IconsService);
  #shareUrlService = inject(ShareUrlService);

  constructor(
    private _route: ActivatedRoute,
    private _partitionsGrpcService: PartitionsGrpcService,
  ) {}

  ngOnInit(): void {
    this.sharableURL = this.#shareUrlService.generateSharableURL(null, null);
  }

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

  getPageIcon(name: Page): string {
    return this.#iconsService.getPageIcon(name);
  }
}
