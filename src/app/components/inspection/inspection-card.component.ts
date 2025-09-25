import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TaskOptions } from '@app/tasks/types';
import { Field } from '@app/types/column.type';
import { DataRaw } from '@app/types/data';
import { InspectionComponent } from './inspection.component';

@Component({
  selector: 'app-inspection-card',
  templateUrl: 'inspection-card.component.html',
  imports: [
    MatCardModule,
    InspectionComponent,
    MatToolbarModule,
  ],
  styleUrl: '../../../inspections.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionCardComponent<T extends DataRaw, O extends TaskOptions | null = null> {
  @Input({ required: false }) fields: Field<T>[];
  @Input({ required: false }) optionsFields: Field<O>[];
  @Input({ required: true }) data: T | null;
}