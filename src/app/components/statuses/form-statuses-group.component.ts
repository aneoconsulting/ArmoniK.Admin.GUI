import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StatusLabelColor } from '@app/types/status';
import { TasksStatusesGroup } from '../../dashboard/types';

@Component({
  selector: 'app-form-statuses-group',
  templateUrl: './form-statuses-group.component.html',
  styles: [`
mat-dialog-content {
  padding-top: 0!important;
  overflow: visible!important;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.statuses {
  grid-column: 1 / span 2;
}

.statuses .inputs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
  `],
  standalone: true,
  providers: [
  ],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormStatusesGroupComponent implements OnInit {
  @Input() group: TasksStatusesGroup | null = null;
  @Input({ required: true }) set statuses(entry: Record<TaskStatus, StatusLabelColor>) {
    this.statusesLabelsColor = entry;
    this.allStatuses = Object.keys(entry);
  }

  private statusesLabelsColor: Record<TaskStatus, StatusLabelColor>;
  allStatuses: string[];

  @Output() cancelChange = new EventEmitter<void>();
  @Output() submitChange = new EventEmitter<TasksStatusesGroup>();

  groupForm: FormGroup;

  ngOnInit() {
    this.groupForm = new FormGroup({
      name: new FormControl<string | null>(this.group?.name ?? null, [
        Validators.required,
      ]),
      color: new FormControl<string | null>(this.group?.color ?? null),
      statuses: new FormControl<TaskStatus[]>(this.group?.statuses ? [...this.group.statuses] : [])
    });
  }

  isChecked(status: string): boolean {
    return this.group?.statuses.includes(Number(status) as TaskStatus) ?? false;
  }

  onCheckboxChange(e: MatCheckboxChange) {
    const statuses = this.groupForm.get('statuses') as FormControl<TaskStatus[]>;
    const status = Number(e.source.value) as TaskStatus;

    if (e.checked) {
      statuses.value.push(status);
      if (!this.groupForm.value.name && statuses.value.length === 1) {
        const statusLabelColor = this.statusesLabelsColor[status];
        this.groupForm.patchValue({name: statusLabelColor.label, color: statusLabelColor.color});
      }
    } else {
      const index = statuses.value.findIndex(s => s === status);
      statuses.value.splice(index, 1);
    }
  }

  getLabel(value: string) {
    return this.statusesLabelsColor[Number(value) as TaskStatus].label;
  }

  onSubmit() {
    const result: TasksStatusesGroup = {
      name: this.groupForm.value.name ?? '',
      color: this.groupForm.value.color ?? '',
      statuses: this.groupForm.value.statuses ?? []
    };

    this.submitChange.emit(result);
  }

  onCancel() {
    this.cancelChange.emit();
  }
}
