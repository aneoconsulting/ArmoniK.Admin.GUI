import { FilterStringOperator, ResultRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { TableColumn } from '@app/types/column.type';
import { ResultData } from '@app/types/data';
import { TaskStatusColored } from '@app/types/dialog';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableCellComponent } from '@components/table/table-cell.component';
import { TableEmptyDataComponent } from '@components/table/table-empty-data.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { ResultsIndexService } from '../services/results-index.service';
import { ResultsStatusesService } from '../services/results-statuses.service';
import { ResultRaw, ResultRawColumnKey, ResultRawFieldKey, ResultRawListOptions } from '../types';

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
    TableCellComponent,
  ]
})
export class ResultsTableComponent implements AfterViewInit {

  @Input({required: true}) displayedColumns: TableColumn<ResultRawColumnKey>[] = [];
  @Input({required: true}) options: ResultRawListOptions;
  @Input({required: true}) total: number;
  @Input() lockColumns = false;
  
  private _data: ResultData[] = [];

  @Input({required: true}) set data(entries: ResultRaw[]) {
    if (entries.length !== 0) {
      this._data = this.data.filter(d => entries.find(entry => entry.resultId === d.raw.resultId));
      entries.forEach((entry, index) => {
        const result = this._data[index];
        if (result && result.raw.resultId === entry.resultId) {
          this._data[index].value$?.next(entry);
        } else {
          const lineData: ResultData = {
            raw: entry,
            value$: new Subject<ResultRaw>(),
          };
          this._data.splice(index, 1, lineData);
        }
      });
      this.dataSource.data = this._data;
    } else {
      this._data = [];
      this.dataSource.data = this._data;
    }
  }

  get data(): ResultData[] {
    return this._data;
  }

  @Output() optionsChange = new EventEmitter<never>();

  tasksStatusesColored: TaskStatusColored[] = [];
  dataSource = new MatTableDataSource<ResultData>(this._data);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  readonly _resultsIndexService = inject(ResultsIndexService);
  readonly _filtersService = inject(FiltersService);
  readonly _resultsStatusesService = inject(ResultsStatusesService);

  get columnKeys() {
    return this.displayedColumns.map(c => c.key);
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => {
      this.options.pageIndex = 0; // If the user change the sort order, reset back to the first page.
      this.options.sort = {
        active: this.sort.active as ResultRawFieldKey,
        direction: this.sort.direction
      };
      this.optionsChange.emit();
    });

    this.paginator.page.subscribe(() => {
      if (this.options.pageSize > this.paginator.pageSize) this._data = [];
      this.options.pageIndex = this.paginator.pageIndex;
      this.options.pageSize = this.paginator.pageSize;
      this.optionsChange.emit();
    });
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);

    this._resultsIndexService.saveColumns(this.displayedColumns.map(column => column.key));
  }

  createSessionIdQueryParams(sessionId: string) {
    const keySession = this._filtersService.createQueryParamsKey<ResultRawEnumField>(1, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID);

    return {
      [keySession]: sessionId,
    };
  }
}