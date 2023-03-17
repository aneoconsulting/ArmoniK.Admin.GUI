import { Component } from "@angular/core";
import { ClrIconModule } from "@clr/angular";

@Component({
  standalone: true,
  selector: 'armonik-admin-gui-datagrid-partitions-get',
  templateUrl: './datagrid-partitions-get.component.html',
  styleUrls: ['./datagrid-partitions-get.component.scss'],
  imports: [
    ClrIconModule,
  ]
})
export class DatagridPartitionsGetComponent {
  public open = false;

  public openModal() {
    this.open = true;
  }

  public closeModal() {
    this.open = false;
  }
}
