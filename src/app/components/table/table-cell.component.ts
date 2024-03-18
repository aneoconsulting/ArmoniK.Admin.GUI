import { DatePipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';
import { Duration, Timestamp } from '@ngx-grpc/well-known-types';
import { Subject } from 'rxjs';
import { TableColumn } from '@app/types/column.type';
import { ApplicationData, ArmonikData, DataRaw, PartitionData, RawColumnKey, SessionData, Status } from '@app/types/data';
import { TaskStatusColored } from '@app/types/dialog';
import { StatusesServiceI } from '@app/types/services';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { DurationPipe } from '@pipes/duration.pipe';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { TableInspectObjectComponent } from './table-inspect-object.component';

@Component({
  selector: 'app-table-cell',
  standalone: true,
  templateUrl: './table-cell.component.html',
  imports: [
    EmptyCellPipe,
    RouterModule,
    NgIf,
    TableInspectObjectComponent,
    DurationPipe,
    DatePipe,
    MatButtonModule,
    CountTasksByStatusComponent,
    MatCheckboxModule,
  ]
})
export class TableCellComponent<T extends ArmonikData<DataRaw>, K extends RawColumnKey, S extends Status> implements OnDestroy{  
  @Input({ required: true }) column: TableColumn<K>;
  @Input({ required: true }) value$: Subject<DataRaw>;
  @Input({ required: true }) set element(entry: T) {
    this._element = entry;
    this._value = this.handleNestedKeys(entry);
    this.value$.subscribe((entry: DataRaw) => {
      this._element.raw = entry;
      this._value = this.handleNestedKeys(this._element);
    });
  }

  @Input({ required: false }) statusesService: StatusesServiceI<S>;
  @Input({ required: false }) isSelected: boolean = false;
  @Input({ required: false }) tasksStatusesColored: TaskStatusColored[] = [];

  @Output() changeSelection = new EventEmitter<void>();

  private _value: unknown;
  private _element: T;

  ngOnDestroy(): void {
    this.value$.unsubscribe();
  }

  get element() {
    return this._element;
  }

  get value() {
    return this._value;
  }

  get durationValue() {
    return this._value as Duration;
  }

  get statusValue() {
    return this._value as S;
  }

  get dateValue(): Date | null {
    return (this.value as Timestamp)?.toDate() ?? null;
  }

  get link() {
    return this.column.link ? `${this.column.link}/${this.element.raw[this.column.key as keyof DataRaw]}` : '';
  }

  get queryTasksParams() {
    return (this._element as unknown as SessionData | ApplicationData | PartitionData).queryTasksParams;
  }

  get countFilters() {
    return (this._element as unknown as SessionData | ApplicationData | PartitionData).filters;
  }

  handleNestedKeys(element: T) {
    if (element === undefined || element.raw === undefined) {
      return undefined;
    }
    const keys = `${this.column.key}`.split('.') as unknown as K[];
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

  statusLabel(): string {
    return this.statusesService.statusToLabel(this.statusValue);
  }
}