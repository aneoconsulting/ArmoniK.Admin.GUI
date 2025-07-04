import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NavigationExtras, Params, Router, RouterModule } from '@angular/router';
import { TasksStatusesGroup } from '@app/dashboard/types';
import { TaskOptions } from '@app/tasks/types';
import { TableColumn } from '@app/types/column.type';
import { ApplicationData, ArmonikData, DataRaw, PartitionData, SessionData } from '@app/types/data';
import { Status, StatusLabelColor, StatusService } from '@app/types/status';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { StatusChipComponent } from '@components/status-chip.component';
import { Duration, Timestamp } from '@ngx-grpc/well-known-types';
import { DurationPipe } from '@pipes/duration.pipe';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { Subject } from 'rxjs';
import { ByteArrayComponent } from './cells/byte-array-cell.component';
import { TableInspectMessageComponent } from './table-inspect-message.component';
import { TableInspectObjectComponent } from './table-inspect-object.component';

@Component({
  selector: 'app-table-cell',
  standalone: true,
  templateUrl: './table-cell.component.html',
  imports: [
    EmptyCellPipe,
    RouterModule,
    TableInspectObjectComponent,
    DurationPipe,
    DatePipe,
    MatButtonModule,
    CountTasksByStatusComponent,
    MatCheckboxModule,
    TableInspectMessageComponent,
    StatusChipComponent,
    ByteArrayComponent,
  ]
})
export class TableCellComponent<T extends DataRaw, S extends Status, O extends TaskOptions | null = null>{
  @Input({ required: true }) set column(entry: TableColumn<T, O>) {
    this._column = entry;
    if (entry.key === 'count') {
      this.refreshStatuses = new Subject<void>();
    }
  }

  @Input({ required: true }) set element(entry: ArmonikData<T, O>) {
    this._element = entry;
    this._value = this.handleNestedKeys(entry);
    if (entry) {
      this._queryParams = this.element.queryParams?.get(this.column.key);
      this.createLink();
      if (this.column.key === 'count') {
        this.refreshStatuses.next();
      }
    }
  }

  @Input({ required: false }) statusesService: StatusService<S>;
  @Input({ required: false }) isSelected: boolean = false;
  @Input({ required: false }) statusesGroups: TasksStatusesGroup[] = [];

  @Output() changeSelection = new EventEmitter<void>();

  private readonly router = inject(Router);

  private _value: unknown;
  private _element: ArmonikData<T, O>;
  private _column: TableColumn<T, O>;

  private _link: string;
  private _queryParams: Params | undefined;
  refreshStatuses: Subject<void>;

  get column() {
    return this._column;
  }

  get element() {
    return this._element;
  }

  get value() {
    return this._value;
  }

  get string() {
    return this._value as string;
  }

  get durationValue() {
    return this._value as Duration;
  }

  get dateValue(): Date | null {
    return (this.value as Timestamp)?.toDate() ?? null;
  }

  get link() {
    return this._link;
  }

  get queryParams() {
    return this._queryParams;
  }

  get queryTasksParams() {
    return (this._element as unknown as SessionData | ApplicationData | PartitionData).queryTasksParams;
  }

  get countFilters() {
    return (this._element as unknown as SessionData | ApplicationData | PartitionData).filters;
  }

  get byteArray() {
    return this._value as Uint8Array;
  }

  createLink() {
    if (this.column.link) {
      if (this._queryParams) {
        this._link = this.column.link;
      } else {
        this._link = `${this.column.link}/${this.element.raw[this.column.key as keyof DataRaw]}`;
      }
    } else {
      this._link = '';
    }
  }

  navigate() {
    if (this._link) {
      const extras: NavigationExtras = {
        queryParams: this._queryParams,
      };
      this.router.navigate([this._link], extras);
    }
  }

  handleNestedKeys(element: ArmonikData<T, O>) {
    if (element?.raw === undefined) {
      return undefined;
    }
    const keys = this.column.key.toString().split('.');
    let resultObject: {[key: string]: object} = element.raw as unknown as {[key: string]: object};
    keys.forEach(key => {
      resultObject = resultObject[key] as {[key: string]: object};
    });
    return resultObject;
  }

  onSelectionChange() {
    this.changeSelection.emit();
  }

  checkboxLabel(): string {
    if (this.isSelected) {
      return $localize`Deselect Task ${this.element.raw[this.column.key as keyof DataRaw]}`;
    }
    else {
      return $localize`Select Task ${this.element.raw[this.column.key as keyof DataRaw]}`;
    }
  }

  statusLabel(): StatusLabelColor {
    return this.statusesService.statusToLabel(this._value as S);
  }
}