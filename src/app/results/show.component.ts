import { GetResultResponse } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppShowComponent, ShowActionButton, ShowActionInterface } from '@app/types/components/show';
import { ShowPageComponent } from '@components/show-page.component';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { ResultsFiltersService } from './services/results-filters.service';
import { ResultsGrpcService } from './services/results-grpc.service';
import { ResultsStatusesService } from './services/results-statuses.service';
import { ResultRaw } from './types';

@Component({
  selector: 'app-result-show',
  template: `
<app-show-page [id]="data()?.resultId ?? ''" [data]="data()" [sharableURL]="sharableURL" [statuses]="statuses" [actionsButton]="actionButtons" (refresh)="onRefresh()">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getIcon('results')"></mat-icon>
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
    TableService,
    TableStorageService,
    TableURLService,
    ResultsFiltersService,
    NotificationService,
    MatSnackBar
  ],
  imports: [
    ShowPageComponent,
    MatIconModule,
  ]
})
export class ShowComponent extends AppShowComponent<ResultRaw, GetResultResponse> implements OnInit, AfterViewInit, ShowActionInterface, OnDestroy {

  readonly grpcService = inject(ResultsGrpcService);
  private readonly resultsStatusesService = inject(ResultsStatusesService);

  actionButtons: ShowActionButton[] = [
    {
      id: 'session',
      name: $localize`See session`,
      icon: this.getIcon('sessions'),
      link: '/sessions'
    },
    {
      id: 'task',
      name: $localize`See owner task`,
      icon: this.getIcon('tasks'),
      link: '/tasks'
    }
  ];

  ngOnInit(): void {
    this.sharableURL = this.getSharableUrl();
  }

  ngAfterViewInit(): void {
    this.subscribeToData();
    this.getIdByRoute();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  getDataFromResponse(data: GetResultResponse): ResultRaw | undefined {
    return data.result;
  }

  afterDataFetching(): void {
    const data = this.data();
    if (data) {
      this.setLink('session', 'sessions', data.sessionId);
      if(!data.ownerTaskId || data.sessionId === data.ownerTaskId) {
        this.actionButtons = this.actionButtons.filter(element => element.id !== 'task');
      } else {
        this.setLink('task', 'tasks', data.ownerTaskId);
      }
    }
  }

  get statuses() {
    return this.resultsStatusesService.statuses;
  }

  setLink(actionId: string, baseLink: string, id: string) {
    const index = this.actionButtons.findIndex(element => element.id === actionId);
    if (index !== -1) {
      this.actionButtons[index].link = `/${baseLink}/${id}`;
    }
  }
}
