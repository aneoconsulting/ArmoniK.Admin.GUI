import { JsonPipe, NgFor } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatTableModule } from '@angular/material/table';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { PartitionsClient, ListPartitionsRequest, ListPartitionsResponse, PartitionRaw } from '@aneoconsultingfr/armonik.api.angular'

@Component({
  selector: 'app-partitions',
  providers: [PartitionsClient],
  imports: [
    NgFor,
    JsonPipe,
    MatTableModule,
    DragDropModule
  ],
  template: `<h1>Partitions</h1>

  <table mat-table [dataSource]="dataSource" cdkDropList cdkDropListOrientation="horizontal" (cdkDropListDropped)="drop($event)">

    <ng-container *ngFor="let column of displayedColumns" [matColumnDef]="column">
      <th mat-header-cell *matHeaderCellDef cdkDrag> {{ column }} </th>
      <td mat-cell *matCellDef="let element"> {{ element[column] }} </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>
  `,
  standalone: true
})
export class IndexComponent implements OnInit {
  displayedColumns: string[] = ['id', 'priority'];
  dataSource: PartitionRaw.AsObject[] = [];

  constructor(private partitionsClient: PartitionsClient) {}

  ngOnInit() {
    const listPartitionsRequest = new ListPartitionsRequest({
      page: 0,
      pageSize: 10,
      sort: {
        direction: ListPartitionsRequest.OrderDirection.ORDER_DIRECTION_ASC,
        field: ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_ID
      },
      filter: {
        id: '',
        parentPartitionId: '',
        podMax: 0,
        podReserved: 0,
        preemptionPercentage: 0,
        priority: 0,
      }
    });
    this.partitionsClient.listPartitions(listPartitionsRequest).subscribe(result => {
      this.dataSource = result.partitions ?? [];
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  addColumn() {
    this.displayedColumns.push('podMax');
  }
}
