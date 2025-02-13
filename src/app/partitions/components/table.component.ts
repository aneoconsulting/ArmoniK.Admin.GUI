import { PartitionRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractTaskByStatusTableComponent } from '@app/types/components/table';
import { ArmonikData } from '@app/types/data';
import { Group } from '@app/types/groups';
import { TableComponent } from '@components/table/table.component';
import { FiltersService } from '@services/filters.service';
import { TableTasksByStatus, TasksByStatusService } from '@services/tasks-by-status.service';
import PartitionsDataService from '../services/partitions-data.service';
import { PartitionsFiltersService } from '../services/partitions-filters.service';
import { PartitionRaw } from '../types';

@Component({
  selector: 'app-partitions-table',
  standalone: true,
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
  readonly filtersService = inject(PartitionsFiltersService);
  
  table: TableTasksByStatus = 'partitions';

  ngOnInit(): void {
    this.initTableDataService();
    this.initStatuses();
  }

  isDataRawEqual(value: PartitionRaw, entry: PartitionRaw): boolean {
    return value.id === entry.id;
  }

  trackBy(index: number, item: ArmonikData<PartitionRaw> | Group<PartitionRaw>) {
    if ((item as ArmonikData<PartitionRaw>).raw !== undefined) {
      return (item as ArmonikData<PartitionRaw>).raw.id;
    } else {
      return (item as Group<PartitionRaw>).name();
    }
  }
}