import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DatagridPartitionsListComponent } from "../datagrid-partitions-list/datagrid-partitions-list.component";

@Component({
  standalone: true,
  selector: 'armonik-admin-gui-partitions-list',
  templateUrl: './page-partitions-list-feature.component.html',
  styleUrls: ['./page-partitions-list-feature.component.scss'],
  imports: [
    DatagridPartitionsListComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartitionsListComponent { }
