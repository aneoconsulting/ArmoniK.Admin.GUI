import { FilterStringOperator, SessionRawEnumField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subject, map, switchMap } from 'rxjs';
import { PartitionShowComponent, ShowActionButton } from '@app/types/components/show';
import { Page } from '@app/types/pages';
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
    NotificationService,
    MatSnackBar,
    FiltersService
  ],
  imports: [
    ShowPageComponent,
    MatIconModule
  ]
})
export class ShowComponent implements PartitionShowComponent, OnInit, AfterViewInit {
  sharableURL = '';
  data: PartitionRaw | null = null;
  refresh = new Subject<void>();
  id: string;

  _iconsService = inject(IconsService);
  _shareURLService = inject(ShareUrlService);
  _grpcService = inject(PartitionsGrpcService);
  _route = inject(ActivatedRoute); 
  _notificationService = inject(NotificationService);
  _filtersService = inject(FiltersService);

  actionData = { 
    sessionsQueryParams: {},
    tasksQueryParams: {}
  };

  actionButtons: ShowActionButton[] = [
    {
      name: $localize`See sessions`,
      icon: this.getPageIcon('sessions'),
      link: '/sessions',
      queryParams: this.actionData.sessionsQueryParams,
      area: 'left'
    },
    {
      name: $localize`See tasks`,
      icon: this.getPageIcon('tasks'),
      link: '/tasks',
      queryParams: this.actionData.tasksQueryParams,
      area: 'left'
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
        return data.partition ?? null;
      })
    ).subscribe((data) => this.data = data);

    this._route.params.pipe(
      map(params => params['id']),
    ).subscribe(id => {
      this.id = id;
      this.refresh.next();
    });
  }

  getPageIcon(name: Page): string {
    return this._iconsService.getPageIcon(name);
  }

  getIcon(name: string): string {
    return this._iconsService.getIcon(name);
  }

  sessionsQueryParams(): void {
    const keyTask = this._filtersService.createQueryParamsKey<SessionRawEnumField>(0, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, SessionRawEnumField.SESSION_RAW_ENUM_FIELD_PARTITION_IDS);

    this.actionData.sessionsQueryParams = {
      [keyTask]: this.id
    };
  }

  tasksQueryParams(): void {
    const keyTask = this._filtersService.createQueryParamsKey<TaskOptionEnumField>(0, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID);

    this.actionData.tasksQueryParams = {
      [keyTask]: this.id
    };
  }

  onRefresh() {
    this.refresh.next();
  }
}
