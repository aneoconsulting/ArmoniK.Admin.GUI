import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskOptions } from '@app/tasks/types';
import { Field } from '@app/types/column.type';
import { ShowActionButton } from '@app/types/components/show';
import { DataRaw } from '@app/types/data';
import { StatusLabelColor } from '@app/types/status';
import { InspectionCardComponent } from './inspection/inspection-card.component';
import { InspectionJsonComponent } from './inspection/inspection-json.component';
import { InspectionListGridComponent } from './inspection/inspection-list-grid.component';
import { InspectionHeaderComponent } from './inspection-header.component';
import { InspectionToolbarComponent } from './inspection-toolbar.component';

@Component({
  selector: 'app-show-page',
  templateUrl: './show-page.component.html',
  styleUrl: 'show-page.component.css',
  imports: [
    InspectionCardComponent,
    InspectionHeaderComponent,
    InspectionListGridComponent,
    InspectionToolbarComponent,
    InspectionJsonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowPageComponent<T extends DataRaw, O extends TaskOptions | null = null>{
  @Input({ required: true }) id: string | null = null;
  @Input({required: true }) data: T | null;
  @Input() sharableURL: string | null = null;
  @Input({ required: false }) actionsButton: ShowActionButton[];
  @Output() refresh = new EventEmitter<never>();
  @Input({ required: false }) arrays: Field<T>[];
  @Input({ required: false }) status: StatusLabelColor | undefined;
  @Input({ required: false }) fields: Field<T>[];
  @Input({ required: false }) optionsFields: Field<O>[];

  onRefresh() {
    this.refresh.emit();
  }
}
