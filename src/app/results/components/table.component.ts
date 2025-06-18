import { ResultRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractTableComponent } from '@app/types/components/table';
import { ArmonikData } from '@app/types/data';
import { Group } from '@app/types/groups';
import { TableComponent } from '@components/table/table.component';
import { NotificationService } from '@services/notification.service';
import ResultsDataService from '../services/results-data.service';
import { ResultsFiltersService } from '../services/results-filters.service';
import { ResultsStatusesService } from '../services/results-statuses.service';
import { ResultRaw } from '../types';

@Component({
  selector: 'app-results-table',
  standalone: true,
  templateUrl: './table.component.html', 
  providers: [
    ResultsStatusesService,
    NotificationService,
  ],
  imports: [
    TableComponent,
  ]
})
export class ResultsTableComponent extends AbstractTableComponent<ResultRaw, ResultRawEnumField> implements OnInit {
  readonly tableDataService = inject(ResultsDataService);
  readonly filtersService = inject(ResultsFiltersService);
  readonly statusesService = inject(ResultsStatusesService);

  ngOnInit(): void {
    this.initTableDataService();
  }

  isDataRawEqual(value: ResultRaw, entry: ResultRaw): boolean {
    return value.resultId === entry.resultId;
  }

  trackBy(index: number, item: ArmonikData<ResultRaw> | Group<ResultRaw>): string | number {
    if ((item as ArmonikData<ResultRaw>).raw !== undefined) {
      return (item as ArmonikData<ResultRaw>).raw.resultId;
    } else {
      return (item as Group<ResultRaw>).name();
    }
  }
}