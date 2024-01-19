import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StatusLabeled, TasksStatusesGroup } from '../types';

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
    NgIf,
    NgFor,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class FormStatusesGroupComponent implements OnInit {
  @Input() group: TasksStatusesGroup | null = null;
  @Input({ required: true }) statuses: { name: string, value: string }[] = [];

  @Output() cancelChange = new EventEmitter<void>();
  @Output() submitChange = new EventEmitter<TasksStatusesGroup>();

  groupForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
    color: new FormControl(''),
    statuses: new FormArray<FormControl<string>>([]),
  });

  ngOnInit() {
    if(this.group) {
      this.groupForm.setValue({
        name: this.group.name,
        color: this.group.color ?? null,
        statuses: []
      });
      const statuses = this.groupForm.get('statuses') as FormArray | null;
      if (!statuses) {
        return;
      }

      for (const status of this.group.statuses) {
        statuses.push(new FormControl(status));
      }
    }
  }

  isChecked(status: StatusLabeled): boolean {
    if (!this.group) {
      return false;
    }

    return this.group.statuses.includes(Number(status.value) as TaskStatus);
  }


  onCheckboxChange(e: MatCheckboxChange) {
    const statuses = this.groupForm.get('statuses') as FormArray | null;

    if (!statuses) {
      return;
    }

    if (e.checked) {
      statuses.push(new FormControl(e.source.value));
    } else {
      let i = 0;
      (statuses.controls as FormControl[]).forEach((item: FormControl) => {
        if (item.value == e.source.value) {
          statuses.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  onSubmit() {
    const result: TasksStatusesGroup = {
      name: this.groupForm.value.name ?? '',
      color: this.groupForm.value.color ?? '',
      statuses: this.groupForm.value.statuses?.map((status: string) => Number(status) as TaskStatus) ?? []
    };

    this.submitChange.emit(result);
  }

  onCancel() {
    this.cancelChange.emit();
  }

  trackByStatus(_: number, item: { value: string, name: string }) {
    return item.value;
  }
}
