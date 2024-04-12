import { SessionRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { NoWrapDirective } from '@app/directives/no-wrap.directive';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksIndexService } from '@app/tasks/services/tasks-index.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { TableHandlerCustomValues } from '@app/types/components';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { DurationPipe } from '@pipes/duration.pipe';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { FiltersService } from '@services/filters.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { SessionsTableComponent } from './components/table.component';
import { SessionsFiltersService } from './services/sessions-filters.service';
import { SessionsIndexService } from './services/sessions-index.service';
import { SessionsStatusesService } from './services/sessions-statuses.service';
import { SessionRawColumnKey, SessionRawFilters, SessionRawListOptions } from './types';

@Component({
  selector: 'app-sessions-index',
  templateUrl: './index.component.html',
  styles: [`
.filters {
  height: auto;
  min-height: 64px;

  padding: 1rem;
}
  `],
  standalone: true,
  providers: [
    ShareUrlService,
    QueryParamsService,
    StorageService,
    TableURLService,
    TableStorageService,
    TableService,
    UtilsService,
    AutoRefreshService,
    SessionsIndexService,
    TasksStatusesService,
    TasksIndexService,
    FiltersService,
    TasksFiltersService,
    SessionsFiltersService,
    {
      provide: DATA_FILTERS_SERVICE,
      useExisting: SessionsFiltersService
    },
    SessionsStatusesService,
    MatDialog,
  ],
  imports: [
    DurationPipe,
    EmptyCellPipe,
    NoWrapDirective,
    CountTasksByStatusComponent,
    NgIf,
    NgFor,
    DatePipe,
    RouterLink,
    DragDropModule,
    PageHeaderComponent,
    TableActionsToolbarComponent,
    FiltersToolbarComponent,
    MatTooltipModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
    SessionsTableComponent
  ]
})
export class IndexComponent extends TableHandlerCustomValues<SessionRawColumnKey, SessionRawListOptions, SessionRawFilters, SessionRawEnumField> implements OnInit, AfterViewInit, OnDestroy {
  readonly filtersService = inject(SessionsFiltersService);
  readonly indexService = inject(SessionsIndexService);

  ngOnInit() {
    this.initTableEnvironment();
  }

  ngAfterViewInit(): void {
    this.mergeSubscriptions();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
