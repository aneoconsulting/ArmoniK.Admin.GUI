import { ApplicationRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import {  MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ApplicationsTableComponent } from '@app/applications/components/table.component';
import ApplicationsDataService from '@app/applications/services/applications-data.service';
import { ApplicationsFiltersService } from '@app/applications/services/applications-filters.service';
import { ApplicationsGrpcService } from '@app/applications/services/applications-grpc.service';
import { ApplicationsIndexService } from '@app/applications/services/applications-index.service';
import { ApplicationRaw } from '@app/applications/types';
import { DashboardLineTableComponent } from '@app/types/components/dashboard-line-table';
import { DataFilterService } from '@app/types/services/data-filter.service';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableDashboardActionsToolbarComponent } from '@components/table-dashboard-actions-toolbar.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { DefaultConfigService } from '@services/default-config.service';
import { FiltersService } from '@services/filters.service';
import { GrpcSortFieldService } from '@services/grpc-sort-field.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';

@Component({
  selector: 'app-dashboard-applications-line',
  templateUrl: './applications-line.component.html',
  providers: [
    ShareUrlService,
    AutoRefreshService,
    ApplicationsGrpcService,
    NotificationService,
    ApplicationsIndexService,
    DefaultConfigService,
    MatSnackBar,
    {
      provide: DataFilterService,
      useClass: ApplicationsFiltersService
    },
    ApplicationsFiltersService,
    FiltersService,
    ApplicationsDataService,
    GrpcSortFieldService,
  ],
  imports: [
    FiltersToolbarComponent,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    ApplicationsTableComponent,
    TableDashboardActionsToolbarComponent,
  ]
})
export class ApplicationsLineComponent extends DashboardLineTableComponent<ApplicationRaw, ApplicationRawEnumField> implements OnInit, AfterViewInit,OnDestroy {
  readonly indexService = inject(ApplicationsIndexService);
  readonly defaultConfig = this.defaultConfigService.defaultApplications;
  readonly tableDataService = inject(ApplicationsDataService);

  ngOnInit(): void {
    this.initLineEnvironment();
  }

  ngAfterViewInit() {
    this.mergeSubscriptions();
    this.handleAutoRefreshStart();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}