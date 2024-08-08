import { PartitionRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PartitionsTableComponent } from '@app/partitions/components/table.component';
import { PartitionsFiltersService } from '@app/partitions/services/partitions-filters.service';
import { PartitionsIndexService } from '@app/partitions/services/partitions-index.service';
import { PartitionRaw } from '@app/partitions/types';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { DashboardLineTableComponent } from '@app/types/components/dashboard-line-table';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableDashboardActionsToolbarComponent } from '@components/table-dashboard-actions-toolbar.component';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'app-dashboard-partitions-line',
  templateUrl: './partitions-line.component.html',
  standalone: true,
  providers: [
    PartitionsIndexService,
    NotificationService,
    MatSnackBar,
    PartitionsFiltersService,
    {
      provide: DATA_FILTERS_SERVICE,
      useExisting: PartitionsFiltersService
    },
  ],
  imports: [
    MatToolbarModule,
    TableDashboardActionsToolbarComponent,
    FiltersToolbarComponent,
    PartitionsTableComponent,
    MatIconModule,
    MatMenuModule,
  ]
})
export class PartitionsLineComponent extends DashboardLineTableComponent<PartitionRaw, PartitionRawEnumField> implements OnInit, AfterViewInit, OnDestroy {
  readonly indexService = inject(PartitionsIndexService);
  readonly defaultConfig = this.defaultConfigService.defaultPartitions;

  ngOnInit() {
    this.initLineEnvironment();
  }

  ngAfterViewInit() {
    this.mergeSubscriptions();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}