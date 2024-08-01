import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TaskOptions } from '@app/tasks/types';
import { Field } from '@app/types/column.type';
import { DataRaw, Status } from '@app/types/data';
import { InspectionObjectComponent } from './inspection-object.component';

@Component({
  selector: 'app-inspection',
  templateUrl: 'inspection.component.html',
  standalone: true,
  imports: [
    InspectionObjectComponent,
    MatExpansionModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../../../inspections.css',
})
export class InspectionComponent<T extends DataRaw, S extends Status, O extends TaskOptions | null = null> {
  private _data: T = {} as T;
  private _options: NonNullable<O> = {} as NonNullable<O>;

  /**
   * Displayed fields and their types.
   * If none are provided, every field will be displayed as a "string".
   */
  @Input({ required: false }) fields: Field<T>[] | undefined;

  @Input({ required: false }) optionsFields: Field<O>[] | undefined;

  @Input({ required: true }) set data(entry: T | null) {
    if (entry) {
      this._data = entry;
      if (entry['options' as keyof (T | O)]) {
        this._options = entry['options' as keyof (T | O)] as NonNullable<O>;
      }
    }
  }

  /**
   * Required to display a status label.
   */
  @Input({ required: false }) statuses: Record<S, string>;

  get data(): T {
    return this._data;
  }

  get options() {
    return this._options;
  }
}