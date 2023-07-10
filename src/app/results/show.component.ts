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
import { UtilsService } from '@services/utils.service';
import { ResultsGrpcService } from './services/results-grpc.service';
import { ResultsStatusesService } from './services/results-statuses.service';
import { ResultRaw } from './types';

@Component({
  selector: 'app-result-show',
  template: `
<app-show-page [id]="data?.name ?? null" [data]="data" [sharableURL]="sharableURL" [statuses]="statuses">
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
  ],
  imports: [
    ShowPageComponent,
    MatIconModule,
  ]
})
export class ShowComponent implements AppShowComponent<ResultRaw>, OnInit, AfterViewInit {
  sharableURL = '';
  data: ResultRaw | null = null;

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
    this._route.params.pipe(
      map(params => params['id']),
      switchMap((id) => {
        return this._resultsGrpcService.get$(id);
      }),
      map((data) => {
        return data.result ?? null;
      })
    )
      .subscribe((data) => this.data = data);
  }

  get statuses() {
    return this.#resultsStatusesService.statuses;
  }

  getPageIcon(page: Page): string {
    return this.#iconsService.getPageIcon(page);
  }
}
