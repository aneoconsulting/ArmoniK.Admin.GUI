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
import { ResultsFiltersService } from './services/results-filters.service';
import { ResultsGrpcService } from './services/results-grpc.service';
import { ResultsIndexService } from './services/results-index.service';
import { ResultsStatusesService } from './services/results-statuses.service';
import { ResultRaw } from './types';

@Component({
  selector: 'app-result-show',
  template: `
<app-show-page [id]="data?.name ?? null" [data]="data" [sharableURL]="sharableURL" [statuses]="statuses" type="results" (refresh)="onRefresh()">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getPageIcon('results')"></mat-icon>
  <span i18n="Page title"> Result </span>
</app-show-page>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [
    UtilsService,
    ShareUrlService,
    QueryParamsService,
    ResultsGrpcService,
    ResultsStatusesService,
    ResultsIndexService,
    TableService,
    TableStorageService,
    TableURLService,
    ResultsFiltersService,
  ],
  imports: [
    ShowPageComponent,
    MatIconModule,
  ]
})
export class ShowComponent implements AppShowComponent<ResultRaw>, OnInit, AfterViewInit {
  sharableURL = '';
  data: ResultRaw | null = null;
  refresh = new Subject<void>();
  id: string;

  #iconsService = inject(IconsService);
  #shareURLService = inject(ShareUrlService);
  #resultsStatusesService = inject(ResultsStatusesService);

  constructor(
    private _route: ActivatedRoute,
    private _resultsGrpcService: ResultsGrpcService,
  ) {}

  ngOnInit(): void {
    this.sharableURL = this.#shareURLService.generateSharableURL(null, null);
  }

  ngAfterViewInit(): void {
    this.refresh.pipe(
      switchMap(() => {
        return this._resultsGrpcService.get$(this.id);
      }),
      map((data) => {
        return data.result ?? null;
      })
    ).subscribe((data) => this.data = data);

    this._route.params.pipe(
      map(params => params['id']),
    ).subscribe(id => {
      this.id = id;
      this.refresh.next();
    });
  }

  get statuses() {
    return this.#resultsStatusesService.statuses;
  }

  getPageIcon(page: Page): string {
    return this.#iconsService.getPageIcon(page);
  }

  onRefresh() {
    this.refresh.next();
  }
}
