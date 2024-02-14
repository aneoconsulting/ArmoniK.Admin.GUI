import { FilterStringOperator, ResultRawEnumField, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subject, map, switchMap } from 'rxjs';
import { AppShowComponent, ShowActionButton, ShowActionInterface, ShowCancellableInterface } from '@app/types/components/show';
import { ShowPageComponent } from '@components/show-page.component';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { TasksFiltersService } from './services/tasks-filters.service';
import { TasksGrpcService } from './services/tasks-grpc.service';
import { TasksIndexService } from './services/tasks-index.service';
import { TasksStatusesService } from './services/tasks-statuses.service';
import { TaskRaw } from './types';

@Component({
  selector: 'app-tasks-show',
  template: `
<app-show-page [id]="id" [data]="data" [sharableURL]="sharableURL" [statuses]="statuses" [actionsButton]="actionButtons" (refresh)="onRefresh()">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getPageIcon('tasks')"></mat-icon>
  <span i18n="Page title"> Task </span>
</app-show-page>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [
    IconsService,
    UtilsService,
    ShareUrlService,
    QueryParamsService,
    TasksGrpcService,
    TasksStatusesService,
    TasksIndexService,
    TableService,
    TableStorageService,
    TableURLService,
    TasksFiltersService,
    NotificationService,
    MatSnackBar,
    FiltersService,
  ],
  imports: [
    ShowPageComponent,
    MatIconModule,
  ]
})
export class ShowComponent extends AppShowComponent<TaskRaw, TasksGrpcService> implements OnInit, AfterViewInit, ShowCancellableInterface, ShowActionInterface {
  cancelSession(): void {
    throw new Error('Method not implemented.');
  }

  cancel$ = new Subject<void>();

  private _tasksStatusesService = inject(TasksStatusesService);
  private _filtersService = inject(FiltersService);

  protected override _iconsService = inject(IconsService);
  protected override _grpcService = inject(TasksGrpcService);
  protected override _shareURLService = inject(ShareUrlService);
  protected override _notificationService = inject(NotificationService);
  protected override _route = inject(ActivatedRoute);

  actionButtons: ShowActionButton[] = [
    {
      id: 'session',
      name: $localize`See session`,
      icon: this.getPageIcon('sessions'),
      area: 'left',
      link: '/sessions',
    },
    {
      id: 'results',
      name: $localize`See results`,
      icon: this.getPageIcon('results'),
      area: 'left',
      link: '/results',
      queryParams: {}
    },
    {
      id: 'partition',
      name: $localize`See partition`,
      icon: this.getPageIcon('partitions'),
      area: 'left',
      link: '/partitions',
    },
    {
      id: 'cancel',
      name: $localize`Cancel task`,
      icon: this.getIcon('cancel'),
      color: 'accent',
      area: 'right',
      action$: this.cancel$,
      disabled: this.canCancel()
    }
  ];

  ngOnInit(): void {
    this.sharableURL = this._shareURLService.generateSharableURL(null, null);
  }

  ngAfterViewInit(): void {

    this.refresh.pipe(
      switchMap(() => {
        return this._grpcService.get$(this.id);
      }),
      map((data) => {
        return data.task ?? null;
      })
    ).subscribe((data) => {
      if (data) {
        this.data = data;
        this.setLink('session', 'sessions', data.sessionId);
        if (data.options) this.setLink('partition', 'partitions', data.options.partitionId);
        this.setQueryParams('results', this.resultsKey);
      }
    });

    this._route.params.pipe(
      map(params => params['id']),
    ).subscribe(id => {
      this.id = id;
      this.refresh.next();
    });

    this.cancel$.subscribe(() => this.cancelTask());
  } 
  
  cancelTask(): void {
    if(!this.data) {
      return;
    }

    this._grpcService.cancel$([this.data.id]).subscribe({
      complete: () => {
        this._notificationService.success('Task canceled');
        this.refresh.next();
      },
      error: (error) => {
        console.error(error);
        this._notificationService.error('Unable to cancel task');
      },
    });
  }
  
  canCancel() {
    return this._tasksStatusesService.taskNotEnded(this.data?.status ?? TaskStatus.TASK_STATUS_UNSPECIFIED);
  }

  get resultsKey() {
    return this._filtersService.createQueryParamsKey<ResultRawEnumField>(1, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID);
  }

  setQueryParams(actionId: string, key: string) {
    if(this.data) {
      const action = this.actionButtons.find(element => element.id === actionId);
      if (action) {
        const params: {[key: string]: string} = {}; 
        params[key] = this.id;
        action.queryParams = params;
      }
    }
  }

  setLink(actionId: string, baseLink: string, id: string) {
    const index = this.actionButtons.findIndex(element => element.id === actionId);
    if (index !== -1) {
      this.actionButtons[index].link = `/${baseLink}/${id}`;
    }
  }

  get statuses() {
    return this._tasksStatusesService.statuses;
  }
}
