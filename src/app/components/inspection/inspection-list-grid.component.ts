import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
export class InspectionListGridComponent<T extends DataRaw> {
  @Input({ required: true }) data: T;
  @Input({ required: true }) arrays: Field<T>[];

  getArray(key: keyof T) {
    return this.data[key] as string[];
  }
}