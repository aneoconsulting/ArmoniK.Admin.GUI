import { NgForOf, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {  MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ApplicationsTableComponent } from '@app/applications/components/table.component';
import { ApplicationsFiltersService } from '@app/applications/services/applications-filters.service';
import { ApplicationsGrpcService } from '@app/applications/services/applications-grpc.service';
import { ApplicationsIndexService } from '@app/applications/services/applications-index.service';
import { ApplicationRawColumnKey, ApplicationRawFilters, ApplicationRawListOptions } from '@app/applications/types';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { DashboardLineTableComponent } from '@app/types/components/dashboard-line-table';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { DefaultConfigService } from '@services/default-config.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { ActionsToolbarComponent } from '../../../components/actions-toolbar.component';
import { AutoRefreshButtonComponent } from '../../../components/auto-refresh-button.component';
import { PageSectionHeaderComponent } from '../../../components/page-section-header.component';
import { PageSectionComponent } from '../../../components/page-section.component';
import { RefreshButtonComponent } from '../../../components/refresh-button.component';
import { SpinnerComponent } from '../../../components/spinner.component';
import { StatusesGroupCardComponent } from '../statuses-group-card.component';

@Component({
  selector: 'app-dashboard-applications-line',
  templateUrl: './applications-line.component.html',
  styles: [`
app-table-actions-toolbar {
  flex-grow: 1;
}
.filters {
  height: auto;
  min-height: 64px;
  padding: 1rem;
}
    `],
  standalone: true,
  providers: [
    ShareUrlService,
    AutoRefreshService,
    ApplicationsGrpcService,
    NotificationService,
    ApplicationsIndexService,
    DefaultConfigService,
    MatSnackBar,
    {
      provide: DATA_FILTERS_SERVICE,
      useClass: ApplicationsFiltersService
    },
    ApplicationsFiltersService
  ],
  imports: [
    PageSectionComponent,
    PageSectionHeaderComponent,
    ActionsToolbarComponent,
    RefreshButtonComponent,
    SpinnerComponent,
    AutoRefreshButtonComponent,
    FiltersToolbarComponent,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    StatusesGroupCardComponent,
    NgIf,
    NgForOf,
    ApplicationsTableComponent,
    TableActionsToolbarComponent
  ]
})
export class ApplicationsLineComponent extends DashboardLineTableComponent<ApplicationRawColumnKey, ApplicationRawListOptions, ApplicationRawFilters> implements OnInit, AfterViewInit,OnDestroy {
  readonly indexService = inject(ApplicationsIndexService);

  ngOnInit(): void {
    this.initLineEnvironment();
  }

  ngAfterViewInit() {
    this.mergeSubscriptions();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}