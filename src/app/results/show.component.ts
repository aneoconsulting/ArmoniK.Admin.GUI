import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { Subject, map, switchMap } from 'rxjs';
import { ResultShowComponent, ShowActionButton } from '@app/types/components/show';
import { Page } from '@app/types/pages';
import { ShowPageComponent } from '@components/show-page.component';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { ResultsFiltersService } from './services/results-filters.service';
import { ResultsGrpcService } from './services/results-grpc.service';
import { ResultsIndexService } from './services/results-index.service';
import { ResultsStatusesService } from './services/results-statuses.service';import { ResultRaw } from './types';


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
export class ShowComponent implements ResultShowComponent, OnInit, AfterViewInit {
  sharableURL = '';
  data: ResultRaw | null = null;
  refresh = new Subject<void>();
  id: string;
  actionData: { sessionId: string; partitionId: string; resultsQueryParams: { [key: string]: string; }; taskStatus: TaskStatus; };
  actionButtons: ShowActionButton[];

  _iconsService = inject(IconsService);
  _grpcService = inject(ResultsGrpcService);
  _shareURLService = inject(ShareUrlService);
  _notificationService = inject(NotificationService);
  _resultsStatusesService = inject(ResultsStatusesService);
  _route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.sharableURL = this._shareURLService.generateSharableURL(null, null);
  }

  ngAfterViewInit(): void {
    this.refresh.pipe(
      switchMap(() => {
        return this._grpcService.get$(this.id);
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
    return this._resultsStatusesService.statuses;
  }

  getPageIcon(page: Page): string {
    return this._iconsService.getPageIcon(page);
  }

  getIcon(name: string): string {
    return this._iconsService.getIcon(name);
  }

  onRefresh() {
    this.refresh.next();
  }
}
