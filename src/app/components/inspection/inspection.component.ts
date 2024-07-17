import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import { Field } from '@app/types/column.type';
import { DataRaw, RawColumnKey, Status } from '@app/types/data';
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
export class InspectionComponent<K extends RawColumnKey, D extends DataRaw, S extends Status> {
  private _fields: Field<K>[] = [];
  optionsFields: Field<K>[] = [];
  private _data: D = {} as D;
  
  /**
   * Allows to display the data in a line instead of a column.
   */
  @Input({ required: false }) line = false;

  /**
   * Displayed fields and their types.
   * If none are provided, every field will be displayed as a "string".
   */
  @Input({ required: false }) set fields(entry: Field<K>[] | undefined) {
    if (entry) {
      this.setFields(entry);
    }
  }

  @Input({ required: true }) set data(entry : D | null) {
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

  get fields(): Field<K>[] {
    return this._fields;
  }

  get data(): D {
    return this._data;
  }

  private setFields(fields: Field<K>[]) {
    this._fields = fields.filter(field => !field.key.startsWith('options.'));
    this.optionsFields = fields.filter(field => !this.fields.includes(field)).map(field => {
      return {
        ...field,
        key: field.key.replace('options.', '') as K,
      };
    }).toSorted((a, b) => a.key.localeCompare(b.key));
  }

  private setFieldsFromData(data: D) {
    this._fields = Object.keys(data).map((d) => {
      return {
        key: d as K
      };
    }).toSorted((a, b) => a.key.localeCompare(b.key));
  }

  getObject(field: Field<K>): D {
    return this.data[field.key as unknown as keyof D] as D;
  }

  checkObject(field: Field<K>): boolean {
    return field.type === 'object' || field.key.replace('_', '') === 'options'  || field.key.replace('_', '') === 'output';
  }
}