import { FilterStringOperator, ResultRaw, ResultRawEnumField, ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { Timestamp } from '@ngx-grpc/well-known-types';
import { TaskStatusColored } from '@app/types/dialog';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableEmptyDataComponent } from '@components/table/table-empty-data.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { ResultsIndexService } from '../services/results-index.service';
import { ResultsStatusesService } from '../services/results-statuses.service';
import { ResultRawColumnKey, ResultRawFieldKey, ResultRawListOptions } from '../types';

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
export class ResultsTableComponent implements AfterViewInit {

  @Input({required: true}) displayedColumns: ResultRawColumnKey[] = [];
  @Input({required: true}) options: ResultRawListOptions;
  @Input({required: true}) data: ResultRaw.AsObject[] = [];
  @Input({required: true}) total: number;
  @Input() lockColumns = false;

  @Output() optionsChange = new EventEmitter<never>();

  tasksStatusesColored: TaskStatusColored[] = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  readonly #resultsIndexService = inject(ResultsIndexService);
  readonly #resultsStatusesService = inject(ResultsStatusesService);
  readonly #filtersService = inject(FiltersService);

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
      this.options.pageIndex = this.paginator.pageIndex;
      this.options.pageSize = this.paginator.pageSize;
      this.optionsChange.emit();
    });
  }

  columnToLabel(column: ResultRawColumnKey): string {
    return this.#resultsIndexService.columnToLabel(column);
  }

  prettyDate(element: Timestamp | undefined): Date | null {
    if (!element) {
      return null;
    }

    return element.toDate();
  }

  isResultIdColumn(column: ResultRawColumnKey): boolean {
    return this.#resultsIndexService.isResultIdColumn(column);
  }

  isSessionIdColumn(column: ResultRawColumnKey): boolean {
    return this.#resultsIndexService.isSessionIdColumn(column);
  }

  isDateColumn(column: ResultRawColumnKey): boolean {
    return this.#resultsIndexService.isDateColumn(column);
  }

  isStatusColumn(column: ResultRawColumnKey): boolean {
    return this.#resultsIndexService.isStatusColumn(column);
  }

  isSimpleColumn(column: ResultRawColumnKey): boolean {
    return this.#resultsIndexService.isSimpleColumn(column);
  }

  statusToLabel(status: ResultStatus): string {
    return this.#resultsStatusesService.statusToLabel(status);
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);

    this.#resultsIndexService.saveColumns(this.displayedColumns);
  }

  createSessionIdQueryParams(sessionId: string) {
    const keySession = this.#filtersService.createQueryParamsKey<ResultRawEnumField>(1, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID);

    return {
      [keySession]: sessionId,
    };
  }
}