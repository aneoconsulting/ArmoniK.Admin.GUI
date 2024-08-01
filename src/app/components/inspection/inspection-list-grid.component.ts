import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TaskOptions } from '@app/tasks/types';
import { Field } from '@app/types/column.type';
import { DataRaw } from '@app/types/data';
import { InspectListComponent } from '@components/inspect-list.component';
import { PrettyPipe } from '@pipes/pretty.pipe';

@Component({
  selector: 'app-inspection-list-grid',
  templateUrl: 'inspection-list-grid.component.html',
  standalone: true,
  styleUrl: '../../../inspections.css',
  imports: [
    InspectListComponent,
    PrettyPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionListGridComponent<T extends DataRaw, O extends TaskOptions | null = null> {
  @Input({ required: true }) data: T | null;
  @Input({ required: true }) arrays: Field<T>[] | Field<O>[];

  getArray(key: string | number | symbol) {
    if (this.data) {
      return this.data[key as keyof T] as string[];
    }
    return;
  }
}