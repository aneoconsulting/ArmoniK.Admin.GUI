import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TaskOptions } from '@app/tasks/types';
import { Field } from '@app/types/column.type';
import { DataRaw, TaskOutput } from '@app/types/data';
import { Status } from '@app/types/status';
import { PrettyPipe } from '@pipes/pretty.pipe';
import { FieldContentComponent } from './field-content.component';
import { MessageComponent } from './message.component';

@Component({
  selector: 'app-inspection-object',
  templateUrl: 'inspection-object.component.html',
  standalone: true,
  imports: [
    MatExpansionModule,
    PrettyPipe,
    FieldContentComponent,
    MessageComponent
  ],
  styleUrl: '../../../inspections.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionObjectComponent<T extends DataRaw, S extends Status, O extends TaskOptions | null = null> {
  private _data: T | NonNullable<O> | null;
  private _fields: Field<T>[] | Field<O>[] = [];

  isEmpty: boolean = true;

  @Input({ required: false }) set fields(entries: Field<T>[] | Field<O>[] | undefined) {
    if (entries) {
      this._fields = entries;
    }
  }

  @Input({ required: true }) set data(entry: T | NonNullable<O> | null) {
    this._data = entry;
    if (entry) {
      this.isEmpty = Object.keys(entry).length === 0;
    }
    if (this.fields?.length === 0 && this.data) {
      this.setFieldsFromData(this.data);
    }
  }

  @Input({ required: false }) statuses: Record<S, string>;

  get data() {
    return this._data;
  }

  get fields() {
    return this._fields;
  }

  getError(field: Field<T> | Field<O>): string {
    return ((this.data as T)[field.key as keyof T] as TaskOutput).error;
  }

  getMessage(field: Field<T> | Field<O>): string {
    return (this.data as T)[field.key as keyof T] as string;
  }

  getObject(field: Field<T> | Field<O>): T {
    return (this.data as T | NonNullable<O>)[field.key as keyof (T | O)] as T;
  }

  private setFieldsFromData(data: T | NonNullable<O>) {
    this.fields = Object.keys(data).map((d) => {
      return {
        key: d as keyof (T | O)
      };
    }).toSorted((a, b) => a.key.toString().localeCompare(b.key.toString()));
  }
}