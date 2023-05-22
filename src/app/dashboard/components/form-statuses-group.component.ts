import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StatusLabeled, TasksStatusGroup } from '../types';

@Component({
  selector: 'app-form-statuses-group',
  template: `
<form [formGroup]="groupForm" (ngSubmit)="onSubmit()">
  <mat-dialog-content>

    <mat-form-field appearance="outline">
      <mat-label for="name"> Name </mat-label>
      <input matInput id="name" type="text" formControlName="name" placeholder="Name of your group" required>
       <mat-error *ngIf="groupForm.get('name')?.hasError('required')">
      Email is <strong>required</strong>
      </mat-error>
    </mat-form-field>

    <mat-form-field subscriptSizing="dynamic" appearance="outline">
      <mat-label for="color"> Color </mat-label>
      <input matInput id="color" type="color" formControlName="color" placeholder="color of your group">
    </mat-form-field>

    <h3> Statuses </h3>
    <div id="statuses">
      <mat-checkbox *ngFor="let status of statuses;trackBy:trackByStatus" [value]="status.value" (change)="onCheckboxChange($event)" [checked]="isChecked(status)">
        {{ status.name }}
      </mat-checkbox>
    </div>
  </mat-dialog-content>

  <mat-dialog-actions align="end">
    <button mat-button (click)="onCancel()"> Cancel </button>
    <button mat-flat-button type="submit" color="primary" [disabled]="!groupForm.valid"> Confirm </button>
  </mat-dialog-actions>
</form>
  `,
  styles: [`
mat-dialog-content {
  padding-top: 0!important;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1rem;

  overflow: visible!important;
}

#statuses {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
  @Input() group: TasksStatusGroup | null = null;
  @Input({ required: true }) statuses: { name: string, value: string }[] = [];

  @Output() cancelChange = new EventEmitter<void>();
  @Output() submitChange = new EventEmitter<TasksStatusGroup>();

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

      for (const status of this.group.status) {
        statuses.push(new FormControl(status));
      }
    }
  }

  isChecked(status: StatusLabeled): boolean {
    if (!this.group) {
      return false;
    }

    return this.group.status.includes(Number(status.value) as TaskStatus);
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
    const result = {
      name: this.groupForm.value.name ?? '',
      color: this.groupForm.value.color ?? '',
      status: this.groupForm.value.statuses?.map((status: string) => Number(status) as TaskStatus) ?? []
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
