import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import { TaskOptions } from '@app/tasks/types';
import { Field } from '@app/types/column.type';
import { DataRaw, FieldKey, Status } from '@app/types/data';
import { PrettyPipe } from '@pipes/pretty.pipe';
import { FieldContentComponent } from './field-content.component';

@Component({
  selector: 'app-inspection',
  templateUrl: 'inspection.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    FieldContentComponent,
    JsonPipe,
    PrettyPipe,
    MatExpansionModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    article {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      column-gap: 2rem;
      row-gap: 0.5rem;
    }

    mat-accordion {
      flex-basis: 100%;
      width: fit-content;
    }
  `]
})
export class InspectionComponent<T extends DataRaw, S extends Status, O extends TaskOptions | null = null> {
  private _fields: Field<T, O>[] = [];
  optionsFields: Field<T, O>[] = [];
  private _data: T = {} as T;
  
  /**
   * Allows to display the data in a line instead of a column.
   */
  @Input({ required: false }) line = false;

  /**
   * Displayed fields and their types.
   * If none are provided, every field will be displayed as a "string".
   */
  @Input({ required: false }) set fields(entry: Field<T, O>[] | undefined) {
    if (entry) {
      this.setFields(entry);
    }
  }

  @Input({ required: true }) set data(entry: T | null) {
    if (entry) {
      this._data = entry;
      if (this.fields.length === 0) {
        this.setFieldsFromData(this.data);
      }
    }
  }

  /**
   * Required to display a status label.
   */
  @Input({ required: false }) statuses: Record<S, string>;

  get fields(): Field<T, O>[] {
    return this._fields;
  }

  get data(): T {
    return this._data;
  }

  private setFields(fields: Field<T, O>[]) {
    this._fields = fields.filter(field => !field.key.toString().startsWith('options.'));
    this.optionsFields = fields.filter(field => !this.fields.includes(field)).map(field => {
      return {
        ...field,
        key: field.key.toString().replace('options.', '') as FieldKey<T & O>,
      };
    }).toSorted((a, b) => a.key.toString().localeCompare(b.key.toString()));
  }

  private setFieldsFromData(data: T) {
    this._fields = Object.keys(data).map((d) => {
      return {
        key: d as FieldKey<T & O>
      };
    }).toSorted((a, b) => a.key.toString().localeCompare(b.key.toString()));
  }

  getObject(field: Field<T, O>): T {
    return this.data[field.key as unknown as keyof T] as T;
  }

  checkObject(field: Field<T, O>): boolean {
    return field.type === 'object' || field.key.toString().replace('_', '') === 'options'  || field.key.toString().replace('_', '') === 'output';
  }
}