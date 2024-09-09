import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StatusLabeled, TasksStatusesGroup } from '../../dashboard/types';

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
  @Input({ required: true }) statuses: { name: string, value: string }[] = [];

  @Output() cancelChange = new EventEmitter<void>();
  @Output() submitChange = new EventEmitter<TasksStatusesGroup>();

  groupForm = new FormGroup({
    name: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    color: new FormControl<string | null>(''),
    statuses: new FormControl<TaskStatus[]>([])
  });

  ngOnInit() {
    if(this.group) {
      this.groupForm.patchValue({
        name: this.group.name,
        color: this.group.color ?? null,
        statuses: [...this.group.statuses],
      });
    }
  }

  isChecked(status: StatusLabeled): boolean {
    return this.group?.statuses.includes(Number(status.value) as TaskStatus) ?? false;
  }

  onCheckboxChange(e: MatCheckboxChange) {
    const statuses = this.groupForm.get('statuses') as FormControl<TaskStatus[]>;
    const status = Number(e.source.value) as TaskStatus;

    if (e.checked) {
      statuses.value.push(status);
      if (!this.groupForm.value.name && statuses.value.length === 1) {
        const status = this.statuses.find(status => status.value === e.source.value);
        if (status) {
          this.groupForm.patchValue({name: status.name});
        }
      }
    } else {
      const index = statuses.value.findIndex(s => s === status);
      statuses.value.splice(index, 1);
    }
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
