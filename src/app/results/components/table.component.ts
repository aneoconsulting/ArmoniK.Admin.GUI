import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Scope } from '@app/types/config';
import { ResultData } from '@app/types/data';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { ActionTable } from '@components/table/table-actions.component';
import { TableColumnComponent } from '@components/table/table-column.type';
import { TableEmptyDataComponent } from '@components/table/table-empty-data.component';
import { AbstractTableComponent } from '@components/table/table.abstract.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
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
    MatSortModule,
    NgFor,
    MatTableModule,
    DragDropModule,
    TableColumnComponent,
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

  readonly _resultsStatusesService = inject(ResultsStatusesService);
}