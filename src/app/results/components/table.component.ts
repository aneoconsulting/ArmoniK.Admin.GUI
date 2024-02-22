import { FilterStringOperator, ResultRawEnumField, ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { Timestamp } from '@ngx-grpc/well-known-types';
import { Scope } from '@app/types/config';
import { ResultData } from '@app/types/data';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { ActionTable } from '@components/table/table-actions.component';
import { TableEmptyDataComponent } from '@components/table/table-empty-data.component';
import { AbstractTableComponent } from '@components/table/table.abstract.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { ResultsIndexService } from '../services/results-index.service';
import { ResultsStatusesService } from '../services/results-statuses.service';
import { ResultRaw, ResultRawColumnKey, ResultRawFilters } from '../types';

@Component({
  selector: 'app-results-table',
  standalone: true,
  templateUrl: './table.component.html', 
  styles: [
    
  ],
  providers: [
    MatDialog,
    IconsService,
    FiltersService,
  ],
  imports: [
    TableActionsToolbarComponent,
    FiltersToolbarComponent,
    TableContainerComponent,
    MatPaginatorModule,
    TableEmptyDataComponent,
    MatMenuModule,
    CountTasksByStatusComponent,
    MatSortModule,
    NgFor,
    NgIf,
    MatTableModule,
    MatIconModule,
    RouterModule,
    EmptyCellPipe,
    DragDropModule,
    MatButtonModule,
    DatePipe,
    RouterLink,
  ]
})
export class ResultsTableComponent extends AbstractTableComponent<ResultRawColumnKey, ResultRaw, ResultRawFilters, ResultData> {
  override tableScope: Scope = 'results';

  get data(): ResultData[] {
    return this._data;
  }

  @Input({required: true}) override set inputData(entries: ResultRaw[]) {
    this._data = [];
    entries.forEach((entry) => {
      const lineData: ResultData = {
        raw: entry,
      };
      this._data.push(lineData);
    });
  }

  actions: ActionTable<ResultData>[];
  
  readonly #resultsIndexService = inject(ResultsIndexService);
  readonly #resultsStatusesService = inject(ResultsStatusesService);
  readonly #filtersService = inject(FiltersService);

  prettyDate(element: Timestamp | undefined): Date | null {
    if (!element) {
      return null;
    }

    return element.toDate();
  }
  statusToLabel(status: ResultStatus): string {
    return this.#resultsStatusesService.statusToLabel(status);
  }

  createSessionIdQueryParams(sessionId: string) {
    const keySession = this.#filtersService.createQueryParamsKey<ResultRawEnumField>(1, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID);

    return {
      [keySession]: sessionId,
    };
  }
}