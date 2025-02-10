import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { TasksStatusesGroup } from '@app/dashboard/types';
import { TaskOptions } from '@app/tasks/types';
import { TableColumn } from '@app/types/column.type';
import { ColumnKey, DataRaw } from '@app/types/data';
import { Group } from '@app/types/groups';
import { Status, StatusService } from '@app/types/status';
import { ActionTable } from '@app/types/table';
import { IconsService } from '@services/icons.service';
import { RefreshButtonComponent } from '../../refresh-button.component';
import { GroupTasksByStatusComponent } from '../grouped-tasks-by-status/group-tasks-by-status.component';
import { TableActionsComponent } from '../table-actions.component';
import { TableCellComponent } from '../table-cell.component';

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
    RefreshButtonComponent,
    GroupTasksByStatusComponent
  ],
  providers: [
    IconsService
  ],
  animations: [
    trigger('rotateFull', [
      state('true', style({ transform: 'rotate(-180deg)' })),
      state('false', style({ transform: 'rotate(0deg)' })),
      transition('true <=> false', [animate('125ms ease-in')])
    ]),
    trigger('expand', [
      state('false', style({ 'height': '0' })),
      state('true', style({})),
      transition('true <=> false', [animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)')])
    ])
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

  columnsKeys: ColumnKey<T, O>[];
  displayedColumns: TableColumn<T, O>[];

  @Output() page = new EventEmitter<number>();

  private readonly iconsService = inject(IconsService);

  pageIndex = 0;
  settingsRotate = false;

  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }

  switchView() {
    this.group.opened = !this.group.opened;
  }

  pageChange(event: PageEvent) {
    this.page.emit(event.pageIndex);
  }
}