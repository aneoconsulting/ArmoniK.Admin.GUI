import { FilterStringOperator, ListResultsResponse, ResultRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { AbstractTableComponent } from '@app/types/components/table';
import { ResultData } from '@app/types/data';
import { TableComponent } from '@components/table/table.component';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { ResultsGrpcService } from '../services/results-grpc.service';
import { ResultsIndexService } from '../services/results-index.service';
import { ResultsStatusesService } from '../services/results-statuses.service';
import { ResultRaw, ResultRawColumnKey, ResultRawFilters, ResultRawListOptions } from '../types';

@Component({
  selector: 'app-results-table',
  standalone: true,
  templateUrl: './table.component.html', 
  providers: [
    ResultsGrpcService,
    ResultsIndexService,
    MatDialog,
    IconsService,
    FiltersService,
  ],
  imports: [
    TableComponent,
  ]
})
export class ResultsTableComponent extends AbstractTableComponent<ResultRaw, ResultRawColumnKey, ResultRawListOptions, ResultRawFilters> implements AfterViewInit{
  readonly _grpcService = inject(ResultsGrpcService);
  readonly indexService = inject(ResultsIndexService);
  readonly statusesService = inject(ResultsStatusesService);

  createSessionIdQueryParams(sessionId: string) {
    const keySession = this.filtersService.createQueryParamsKey<ResultRawEnumField>(1, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID);

    return {
      [keySession]: sessionId,
    };
  }

  computeGrpcData(entries: ListResultsResponse): ResultRaw[] | undefined {
    return entries.results;
  }

  override isDataRawEqual(value: ResultRaw, entry: ResultRaw): boolean {
    return value.resultId === entry.resultId;
  }
  
  override createNewLine(entry: ResultRaw): ResultData {
    return {
      raw: entry,
      value$: new Subject<ResultRaw>(),
    };
  }
}