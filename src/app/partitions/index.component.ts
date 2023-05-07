import { JsonPipe, NgFor } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatTableModule } from '@angular/material/table';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { PartitionsClient, ListPartitionsRequest, ListPartitionsResponse, PartitionRaw } from '@aneoconsultingfr/armonik.api.angular'

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

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

  <table mat-table [dataSource]="dataSource" class="mat-elevation-z8" cdkDropList cdkDropListOrientation="horizontal" (cdkDropListDropped)="drop($event)">

  <ng-container *ngFor="let column of displayedColumns" [matColumnDef]="column">
    <th mat-header-cell *matHeaderCellDef cdkDrag> {{column}} </th>
    <td mat-cell *matCellDef="let element"> {{element[column]}} </td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>


{{ displayedColumns | json }}

<button (click)="addColumn()"> Add symbol </button>

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
