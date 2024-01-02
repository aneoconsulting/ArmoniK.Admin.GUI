import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { Subject, map, switchMap } from 'rxjs';
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
import { PartitionsFiltersService } from './services/partitions-filters.service';
import { PartitionsGrpcService } from './services/partitions-grpc.service';
import { PartitionsIndexService } from './services/partitions-index.service';
import { PartitionRaw } from './types';

@Component({
  selector: 'app-partitions-show',
  template: `
<app-show-page [id]="data?.id ?? null" [data]="data" [sharableURL]="sharableURL" type="partitions" (refresh)="onRefresh()">
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
    PartitionsFiltersService,
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
  refresh = new Subject<void>();
  id: string;

  #iconsService = inject(IconsService);
  #shareUrlService = inject(ShareUrlService);
  #partitionsGrpcService = inject(PartitionsGrpcService);
  #route = inject(ActivatedRoute); 

  ngOnInit(): void {
    this.sharableURL = this.#shareUrlService.generateSharableURL(null, null);
  }

  ngAfterViewInit(): void {
    this.refresh.pipe(
      switchMap(() => {
        return this.#partitionsGrpcService.get$(this.id);
      }),
      map((data) => {
        return data.partition ?? null;
      })
    ).subscribe((data) => this.data = data);
    this.#route.params.pipe(
      map(params => params['id']),
    ).subscribe(id => {
      this.id = id;
      this.refresh.next();
    });
  }

  getPageIcon(name: Page): string {
    return this.#iconsService.getPageIcon(name);
  }

  onRefresh() {
    this.refresh.next();
  }
}
