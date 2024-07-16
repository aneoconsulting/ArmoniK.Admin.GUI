import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Field } from '@app/types/column.type';
import { DataRaw, RawColumnKey, Status } from '@app/types/data';
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
  `]
})
export class InspectionCardComponent<K extends RawColumnKey, D extends DataRaw, S extends Status> {
  @Input({ required: false }) line: boolean;
  @Input({ required: false }) fields: Field<K>[];
  @Input({ required: false }) statuses: Record<S, string>;
  @Input({ required: true }) data: D | null;
}