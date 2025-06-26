import { PartitionRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractTaskByStatusTableComponent } from '@app/types/components/table';
import { ArmonikData } from '@app/types/data';
import { TableComponent } from '@components/table/table.component';
import { FiltersService } from '@services/filters.service';
import { TableTasksByStatus, TasksByStatusService } from '@services/tasks-by-status.service';
import PartitionsDataService from '../services/partitions-data.service';
import { PartitionRaw } from '../types';

@Component({
  selector: 'app-partitions-table',
  templateUrl: './table.component.html',
  providers: [
    TasksByStatusService,
    FiltersService,
  ],
  imports: [
    TableComponent,
  ]
})
export class PartitionsTableComponent extends AbstractTaskByStatusTableComponent<PartitionRaw, PartitionRawEnumField>
  implements OnInit {
  
  readonly tableDataService = inject(PartitionsDataService);
  
  table: TableTasksByStatus = 'partitions';

  ngOnInit(): void {
    this.initTableDataService();
    this.initStatuses();
  }

  isDataRawEqual(value: PartitionRaw, entry: PartitionRaw): boolean {
    return value.id === entry.id;
  }

  trackBy(index: number, items: ArmonikData<PartitionRaw>) {
    return items.raw.id;
  }
}