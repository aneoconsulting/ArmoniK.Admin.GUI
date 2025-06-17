import { ResultRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractTableComponent } from '@app/types/components/table';
import { ArmonikData } from '@app/types/data';
import { TableComponent } from '@components/table/table.component';
import { NotificationService } from '@services/notification.service';
import ResultsDataService from '../services/results-data.service';
import { ResultsStatusesService } from '../services/results-statuses.service';
import { ResultRaw } from '../types';

@Component({
  selector: 'app-results-table',
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
  readonly statusesService = inject(ResultsStatusesService);

  ngOnInit(): void {
    this.initTableDataService();
  }

  isDataRawEqual(value: ResultRaw, entry: ResultRaw): boolean {
    return value.resultId === entry.resultId;
  }

  trackBy(index: number, item: ArmonikData<ResultRaw>): string | number {
    return item.raw.resultId;
  }
}