import { ResultRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { GrpcAction } from '@app/types/actions.type';
import { AbstractTableComponent } from '@app/types/components/table';
import { ArmonikData } from '@app/types/data';
import { GrpcActionsService } from '@app/types/services/grpc-actions.service';
import { StatusService } from '@app/types/status';
import { TableComponent } from '@components/table/table.component';
import { NotificationService } from '@services/notification.service';
import ResultsDataService from '../services/results-data.service';
import { ResultsGrpcService } from '../services/results-grpc.service';
import { ResultsStatusesService } from '../services/results-statuses.service';
import { ResultRaw } from '../types';

@Component({
  selector: 'app-results-table',
  templateUrl: './table.component.html',
  providers: [
    ResultsGrpcService,
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
  readonly grpcService = inject(ResultsGrpcService);
  readonly resultsNotificationService = inject(NotificationService);
  private readonly grpcActions = inject(GrpcActionsService);

  actions: GrpcAction<ResultRaw>[] = [];
  
  @Output() selectionChange = new EventEmitter<ResultRaw[]>();

  ngOnInit(): void {
    this.initTableDataService();
    this.actions.push(...this.grpcActions.actions);
  }

  isDataRawEqual(value: ResultRaw, entry: ResultRaw): boolean {
    return value.resultId === entry.resultId;
  }

  trackBy(index: number, item: ArmonikData<ResultRaw>): string | number {
    return item.raw.resultId;
  }

  onSelectionChange($event: ResultRaw[]): void {
    this.selectionChange.emit($event);
  }
}