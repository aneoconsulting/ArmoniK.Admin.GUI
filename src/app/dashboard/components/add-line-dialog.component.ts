import { Component, Inject, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddLineDialogData, AddLineDialogResult } from '@app/types/dialog';
import { AutoCompleteComponent } from '@components/auto-complete.component';
import { IUserService, UserService } from '@services/user.service';
import { LineType } from '../types';

@Component({
  selector: 'app-add-line-dialog',
  templateUrl: 'add-line-dialog.component.html',
  styleUrl: 'add-line-dialog.component.scss',
  providers: [],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    AutoCompleteComponent,
  ]
})
export class AddLineDialogComponent {
  #userService: IUserService = inject(UserService);

  type: LineType | undefined;
  typeLabel = $localize`Type`;
  validType: boolean;

  get types(): LineType[] {
    const allTypes: LineType[] = ['CountStatus', 'Applications', 'Sessions', 'Tasks', 'Partitions', 'Results'];
    const filteredTypes = allTypes.filter(type => {
      switch (type) {
      case 'Sessions':
        return this.hasSessionsPermission;
      case 'Tasks':
        return this.hasTasksPermission;
      case 'Results':
        return this.hasResultsPermission;
      case 'Applications':
        return this.hasApplicationsPermission;
      case 'Partitions':
        return this.hasPartitionsPermission;
      case 'CountStatus':
        return this.hasCountStatusPermission;
      default:
        return true;
      }
    });
    return filteredTypes;
  }

  private getUserService(): IUserService {
    return this.#userService;
  }

  get hasSessionsPermission(): boolean {
    const userService = this.getUserService();
    const hasListSessions = userService.hasPermission('Sessions:ListSessions');
    const hasGetSession = userService.hasPermission('Sessions:GetSession');
    return hasListSessions || hasGetSession;
  }

  get hasTasksPermission(): boolean {
    const userService = this.getUserService();
    return userService.hasPermission('Tasks:ListTasks') || userService.hasPermission('Tasks:GetTask');
  }

  get hasResultsPermission(): boolean {
    const userService = this.getUserService();
    return userService.hasPermission('Results:ListResults') || userService.hasPermission('Results:GetResult');
  }

  get hasApplicationsPermission(): boolean {
    const userService = this.getUserService();
    return userService.hasPermission('Applications:ListApplications') || userService.hasPermission('Applications:GetApplication');
  }

  get hasPartitionsPermission(): boolean {
    const userService = this.getUserService();
    return userService.hasPermission('Partitions:ListPartitions') || userService.hasPermission('Partitions:GetPartition');
  }

  get hasCountStatusPermission(): boolean {
    const userService = this.getUserService();
    return userService.hasPermission('Tasks:CountTasksByStatus');
  }

  get hasAvailableTypes(): boolean {
    return this.types.length > 0;
  }

  formGroup = new FormGroup({
    name: new FormControl<string>('')
  });

  constructor(
    public _dialogRef: MatDialogRef<AddLineDialogComponent, AddLineDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data?: AddLineDialogData,
  ) {
    if (this.data?.type && this.types.includes(this.data.type)) {
      this.type = this.data.type;
    } else {
      this.type = undefined;
    }
    this.validType = this.isValidType(this.type ?? '');
    this.formGroup.controls.name.setValue(this.data?.name ?? null);
  }

  onSubmit() {
    if (this.validType) {
      const result: AddLineDialogResult = {
        name: this.formGroup.getRawValue().name ?? '',
        type: this.type as LineType
      };
      this._dialogRef.close(result);
    }
  }

  onCancel(): void {
    this._dialogRef.close();
  }

  onTypeChange(value: string) {
    if (this.isValidType(value)) {
      this.type = value as LineType;
      this.validType = true;
    } else {
      this.type = undefined;
      this.validType = false;
    }
  }

  isValidType(value: string) {
    return this.types.includes(value as LineType);
  }
}
