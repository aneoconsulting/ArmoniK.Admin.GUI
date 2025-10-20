import { ResultRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractTableComponent } from '@app/types/components/table';
import { ArmonikData } from '@app/types/data';
import { StatusService } from '@app/types/status';
import { ActionTable } from '@app/types/table';
import { TableComponent } from '@components/table/table.component';
import { NotificationService } from '@services/notification.service';
import ResultsDataService from '../services/results-data.service';
import { ResultsStatusesService } from '../services/results-statuses.service';
import { ResultRaw } from '../types';
import { TaskOptions } from '@app/tasks/types';
import { Subject } from 'rxjs';

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
  readonly statusesService: ResultsStatusesService = inject(StatusService);

    downloadResult$ = new Subject<ArmonikData<ResultRaw>>();
    downloadResultSubscription = this.downloadResult$.subscribe(data => this.onDownload(data.raw.resultId));

    actions: ActionTable<ResultRaw>[] = [
    {
      label: 'Download result data',
      icon: 'download',
      action$: this.downloadResult$,
    },
  ];

  ngOnInit(): void {
    this.initTableDataService();
  }

  isDataRawEqual(value: ResultRaw, entry: ResultRaw): boolean {
    return value.resultId === entry.resultId;
  }

  onDownload(resultId: string) {
    this.tableDataService.onDownload(resultId);
  }

  trackBy(index: number, item: ArmonikData<ResultRaw>): string | number {
    return item.raw.resultId;
  }
}