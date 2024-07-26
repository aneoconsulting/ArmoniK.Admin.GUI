import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TaskOptions } from '@app/tasks/types';
import { Field } from '@app/types/column.type';
import { DataRaw, Status } from '@app/types/data';
import { InspectionComponent } from './inspection.component';

@Component({
  selector: 'app-inspection-card',
  templateUrl: 'inspection-card.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    InspectionComponent
  ],
  styles: [`
  app-inspection {
    padding: 1rem;
  }  
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionCardComponent<T extends DataRaw, S extends Status, O extends TaskOptions | null = null> {
  @Input({ required: false }) fields: Field<T>[];
  @Input({ required: false }) optionsFields: Field<O>[];
  @Input({ required: false }) statuses: Record<S, string>;
  @Input({ required: true }) data: T | null;
}