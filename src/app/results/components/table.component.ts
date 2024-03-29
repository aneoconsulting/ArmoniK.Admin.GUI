import { FilterStringOperator, ResultRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { AbstractTableComponent } from '@app/types/components/table';
import { ResultData } from '@app/types/data';
import { TableComponent } from '@components/table/table.component';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { ResultsIndexService } from '../services/results-index.service';
import { ResultsStatusesService } from '../services/results-statuses.service';
import { ResultRaw, ResultRawColumnKey, ResultRawListOptions } from '../types';

@Component({
  selector: 'app-results-table',
  standalone: true,
  templateUrl: './table.component.html', 
  providers: [
    MatDialog,
    IconsService,
    FiltersService,
  ],
  imports: [
    TableComponent,
  ]
})
export class ResultsTableComponent extends AbstractTableComponent<ResultRaw, ResultRawColumnKey, ResultRawListOptions> implements AfterViewInit{
  override readonly indexService = inject(ResultsIndexService);
  readonly statusesService = inject(ResultsStatusesService);

  createSessionIdQueryParams(sessionId: string) {
    const keySession = this.filtersService.createQueryParamsKey<ResultRawEnumField>(1, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID);

    return {
      [keySession]: sessionId,
    };
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