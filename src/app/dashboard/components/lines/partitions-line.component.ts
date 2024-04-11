import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PartitionsTableComponent } from '@app/partitions/components/table.component';
import { PartitionsFiltersService } from '@app/partitions/services/partitions-filters.service';
import { PartitionsIndexService } from '@app/partitions/services/partitions-index.service';
import { PartitionRawColumnKey, PartitionRawFilters, PartitionRawListOptions } from '@app/partitions/types';
import { DashboardLineTableComponent } from '@app/types/components/dashboard-line-table';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableDashboardActionsToolbarComponent } from '@components/table-dashboard-actions-toolbar.component';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'app-dashboard-partitions-line',
  templateUrl: './partitions-line.component.html',
  standalone: true,
  styles: [`
.filters {
  height: auto;
  min-height: 64px;
  padding: 1rem;
}  
  `],
  providers: [
    PartitionsIndexService,
    NotificationService,
    MatSnackBar,
    PartitionsFiltersService,
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
export class PartitionsLineComponent extends DashboardLineTableComponent<PartitionRawColumnKey, PartitionRawListOptions, PartitionRawFilters> implements OnInit, AfterViewInit, OnDestroy {
  readonly indexService = inject(PartitionsIndexService);

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