import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {  FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {  MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AddLineDialogResult } from '@app/types/dialog';
import { LineType } from '../types';

@Component({
  selector: 'app-form-name-line',
  templateUrl: './form-name-line.component.html',
  styles: [`
mat-dialog-content {
  padding-top: 0!important;
  overflow: visible!important;

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
    ReactiveFormsModule,
    MatSelectModule
  ]
})
export class FormNameLineComponent implements OnInit {
  @Input() line: string | null = null;
  @Input() type: string | null = null;
  types: LineType[] = ['CountStatus', 'Applications', 'Sessions', 'Tasks', 'Partitions'];

  @Output() cancelChange = new EventEmitter<void>();
  @Output() submitChange = new EventEmitter<AddLineDialogResult>();

  lineForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
    type: new FormControl('', [
      Validators.required
    ])
  });

  ngOnInit() {

    if(this.line && this.type) {
      this.lineForm.setValue({
        name: this.line,
        type: this.type
      });
    }

  }

  onSubmit() {
    const result = {
      name: this.lineForm.value.name ?? '',
      type: this.lineForm.value.type ?? ''
    } as AddLineDialogResult;
    this.submitChange.emit(result);
  }

  onCancel() {
    this.cancelChange.emit();
  }

  trackByStatus(_: number, item: { value: string, name: string }) {
    return item.value;
  }

  trackByOption(_: number, item: string) {
    return item;
  }
}
