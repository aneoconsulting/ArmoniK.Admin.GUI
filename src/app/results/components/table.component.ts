import { FilterStringOperator, ListResultsResponse, ResultRawEnumField, SessionRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AbstractTableComponent } from '@app/types/components/table';
import { Scope } from '@app/types/config';
import { ResultData } from '@app/types/data';
import { TableComponent } from '@components/table/table.component';
import { FiltersService } from '@services/filters.service';
import { GrpcSortFieldService } from '@services/grpc-sort-field.service';
import { NotificationService } from '@services/notification.service';
import { ResultsFiltersService } from '../services/results-filters.service';
import { ResultsGrpcService } from '../services/results-grpc.service';
import { ResultsIndexService } from '../services/results-index.service';
import { ResultsStatusesService } from '../services/results-statuses.service';
import { ResultRaw, ResultRawColumnKey, ResultRawFieldKey, ResultRawListOptions } from '../types';

@Component({
  selector: 'app-results-table',
  standalone: true,
  templateUrl: './table.component.html', 
  providers: [
    ResultsGrpcService,
    ResultsIndexService,
    MatDialog,
    FiltersService,
    NotificationService,
    ResultsStatusesService,
    ResultsFiltersService,
    GrpcSortFieldService,
  ],
  imports: [
    TableComponent,
  ]
})
export class ResultsTableComponent extends AbstractTableComponent<ResultRaw, ResultRawColumnKey, ResultRawFieldKey, ResultRawListOptions, ResultRawEnumField>
  implements OnInit, AfterViewInit {
  scope: Scope = 'results';
  readonly grpcService = inject(ResultsGrpcService);
  readonly indexService = inject(ResultsIndexService);
  readonly statusesService = inject(ResultsStatusesService);

  ngOnInit(): void {
    this.initTable();
  }

  ngAfterViewInit(): void {
    this.subscribeToData();
  }

  createSessionIdQueryParams(sessionId: string) {
    const keySession = this.filtersService.createQueryParamsKey<SessionRawEnumField>(1, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID);

    return {
      [keySession]: sessionId,
    };
  }

  computeGrpcData(entries: ListResultsResponse): ResultRaw[] | undefined {
    return entries.results;
  }

  isDataRawEqual(value: ResultRaw, entry: ResultRaw): boolean {
    return value.resultId === entry.resultId;
  }
  
  createNewLine(entry: ResultRaw): ResultData {
    return {
      raw: entry,
    };
  }
}