import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ResultsTableComponent } from '@app/results/components/table.component';
import { ResultsIndexService } from '@app/results/services/results-index.service';
import { ResultRawColumnKey, ResultRawFilters, ResultRawListOptions } from '@app/results/types';
import { DashboardLineTableComponent } from '@app/types/components/dashboard-line-table';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableDashboardActionsToolbarComponent } from '@components/table-dashboard-actions-toolbar.component';

@Component({
  selector: 'app-dashboard-results-line',
  templateUrl: './results-line.component.html',
  standalone: true,
  providers: [
    MatSnackBar,
    ResultsIndexService,
  ],
  imports: [
    MatIconModule,
    MatToolbarModule,
    TableDashboardActionsToolbarComponent,
    FiltersToolbarComponent,
    ResultsTableComponent,
  ]
})
export class ResultsLineComponent extends DashboardLineTableComponent<ResultRawColumnKey, ResultRawListOptions, ResultRawFilters> implements OnInit, OnDestroy, AfterViewInit {
  readonly indexService = inject(ResultsIndexService);

  ngOnInit(): void {
    this.initLineEnvironment();
  }

  ngAfterViewInit(): void {
    this.mergeSubscriptions();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}