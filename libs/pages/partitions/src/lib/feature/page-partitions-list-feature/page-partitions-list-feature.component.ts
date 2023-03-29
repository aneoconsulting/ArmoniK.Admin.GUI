import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DatagridStorageService } from "../../data-access/datagrid-storage.service";
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
export class PartitionsListComponent {
}
