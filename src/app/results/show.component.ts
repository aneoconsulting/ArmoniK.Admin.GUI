import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, switchMap } from 'rxjs';
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
import { ResultsStatusesService } from './services/results-statuses.service';import { ResultRaw } from './types';


@Component({
  selector: 'app-result-show',
  template: `
<app-show-page [id]="data?.resultId ?? ''" [data$]="data$" [sharableURL]="sharableURL" [statuses]="statuses" [actionsButton]="actionButtons" (refresh)="onRefresh()">
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
export class ShowComponent extends AppShowComponent<ResultRaw, ResultsGrpcService> implements OnInit, AfterViewInit, ShowActionInterface {

  protected override _grpcService = inject(ResultsGrpcService);
  private _resultsStatusesService = inject(ResultsStatusesService);

  actionButtons: ShowActionButton[] = [
    {
      id: 'session',
      name: $localize`See session`,
      icon: this.getPageIcon('sessions'),
      link: '/sessions'
    },
    {
      id: 'task',
      name: $localize`See owner task`,
      icon: this.getPageIcon('tasks'),
      link: '/tasks'
    }
  ];

  ngOnInit(): void {
    this.sharableURL = this.getSharableUrl();
  }

  ngAfterViewInit(): void {
    this.refresh.pipe(
      switchMap(() => {
        return this._grpcService.get$(this.id);
      }),
      map((data) => {
        return data.result ?? null;
      }),
      catchError(error => this.handleError(error))
    ).subscribe((data) => {
      if (data) {
        this.data = data;
        this.setLink('session', 'sessions', data.sessionId);
        if(data.sessionId === data.ownerTaskId) {
          this.actionButtons = this.actionButtons.filter(element => element.id !== 'task');
        } else {
          this.setLink('task', 'tasks', data.ownerTaskId);
        }
        this.data$.next(data);
      }
    });

    this.getIdByRoute();
  }

  get statuses() {
    return this._resultsStatusesService.statuses;
  }

  setLink(actionId: string, baseLink: string, id: string) {
    const index = this.actionButtons.findIndex(element => element.id === actionId);
    if (index !== -1) {
      this.actionButtons[index].link = `/${baseLink}/${id}`;
    }
  }
}
