import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { TasksStatusesGroup } from '@app/dashboard/types';
import { TaskOptions } from '@app/tasks/types';
import { TableColumn } from '@app/types/column.type';
import { ArmonikData, ColumnKey, DataRaw } from '@app/types/data';
import { Group } from '@app/types/groups';
import { Status, StatusService } from '@app/types/status';
import { ActionTable } from '@app/types/table';
import { TableActionsComponent } from '@components/table/table-actions.component';
import { TableCellComponent } from '@components/table/table-cell.component';
import { IconsService } from '@services/icons.service';
import { rotateFull, expand } from '@shared/animations';
import { GroupTasksByStatusComponent } from '../grouped-tasks-by-status/group-tasks-by-status.component';

@Component({
  selector: 'app-table-group',
  templateUrl: 'group.component.html',
  styleUrl: 'group.component.css',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    TableCellComponent,
    TableActionsComponent,
    GroupTasksByStatusComponent,
    AsyncPipe,
  ],
  providers: [
    IconsService
  ],
  animations: [
    rotateFull,
    expand,
  ]
})
export class TableGroupComponent<T extends DataRaw, S extends Status, O extends TaskOptions | null = null> {
  @Input({ required: true }) group: Group<T, O>;
  @Input({ required: true }) set columns(entry: TableColumn<T, O>[]) {
    this.displayedColumns = entry;
    this.columnsKeys = entry.map(column => column.key);
  }

  @Input({ required: false }) actions: ActionTable<T, O>[];
  @Input({ required: false }) statusesService: StatusService<S>;
  @Input({ required: false }) statusesGroups: TasksStatusesGroup[];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Input({ required: false }) trackBy(index: number, item: ArmonikData<T, O> | Group<T, O>): number | string {
    return index;
  }

  columnsKeys: ColumnKey<T, O>[];
  displayedColumns: TableColumn<T, O>[];

  @Output() page = new EventEmitter<void>();

  private readonly iconsService = inject(IconsService);

  settingsRotate = false;

  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }

  switchView() {
    this.group.opened = !this.group.opened;
  }

  pageChange(event: PageEvent) {
    this.group.page = event.pageIndex;
    this.page.emit();
  }
}