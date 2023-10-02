import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { TaskStatusColored, ViewTasksByStatusDialogData } from '@app/types/dialog';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-view-tasks-by-status-dialog',
  template: `
  <!-- TODO: Update title (capitalize) -->
<h2 mat-dialog-title i18n="Dialog title">Personalize tasks by status</h2>

<mat-dialog-content>
  <p i18n="Dialog description">Select the statuses you want to see</p>

  <div cdkDropList (cdkDropListDropped)="drop($event)" class="statuses">
    <div cdkDrag class="status" *ngFor="let count of statusesCounts; let index = index">
      <div class="status-drag">
        <mat-icon cdkDragHandle aria-hidden="true" i18n-aria-label aria-label="Drag status" [fontIcon]="getIcon('drag')"></mat-icon>
      </div>

      <mat-form-field appearance="outline"  subscriptSizing="dynamic">
        <mat-label i18n="Label input">Status</mat-label>
        <mat-select (valueChange)="onStatusChange(index, $event)" [value]="count.status.toString()">
          <mat-option *ngFor="let status of tasksStatuses(); trackBy:trackByStatus" [value]="status" [disabled]="disableStatus(status)">
            {{ statusToLabel(status) }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field subscriptSizing="dynamic" appearance="outline">
        <mat-label for="color" i18n="Color of the statuses group"> Color </mat-label>
        <input matInput id="color" type="color" formControlName="color" i18n-placeholder="Placeholder" placeholder="color of your group" [value]="count.color" (change)="onColorChange(index, $event)">
      </mat-form-field>

      <button mat-icon-button aria-label="More options" mat-tooltip="More options" [matMenuTriggerFor]="menu">
        <mat-icon aria-hidden="true" [fontIcon]="getIcon('more')"></mat-icon>
      </button>

      <mat-menu #menu="matMenu">
        <button mat-menu-item (click)="onClear(count)">
          <mat-icon aria-hidden="true" [fontIcon]="getIcon('clear')"></mat-icon>
          <span i18n>Clear</span>
        </button>
        <button mat-menu-item (click)="onRemove(index)" [disabled]="statusesCounts?.length === 1 && index === 0">
          <mat-icon aria-hidden="true" [fontIcon]="getIcon('delete')"></mat-icon>
          <span i18n>Remove</span>
        </button>
      </mat-menu>
    </div>
  </div>

  <button class="add-status" mat-button (click)="onAdd()">
    <mat-icon aria-hidden="true" [fontIcon]="getIcon('add')"></mat-icon>
    <span i18n> Add a status </span>
  </button>
</mat-dialog-content>

<mat-dialog-actions align="end">
  <button mat-button (click)="onNoClick()" i18n="Dialog action"> Cancel </button>
  <button mat-flat-button [mat-dialog-close]="statusesCounts" color="primary" i18n="Dialog action"> Confirm </button>
</mat-dialog-actions>
  `,
  styles: [`
.statuses {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.status {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.status-drag {
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: move;
}

.cdk-drag-preview {
  color: rgba(0, 0, 0, 0.6);
}

.cdk-drag-placeholder {
  opacity: 0;
}

.cdk-drag-animating {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
}

.statuses.cdk-drop-list-dragging .status:not(.cdk-drag-placeholder) {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
}

.add-status {
  margin-top: 1rem;
}
  `],
  standalone: true,
  providers: [
    TasksStatusesService,
  ],
  imports: [
    NgFor,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    DragDropModule,
  ],
})
export class ViewTasksByStatusDialogComponent implements OnInit {
  readonly #iconsService = inject(IconsService);

  readonly #defaultStatus = TaskStatus.TASK_STATUS_UNSPECIFIED;
  readonly #defaultColor = '#000000';

  #tasksStatusesService = inject(TasksStatusesService);

  statusesCounts: TaskStatusColored[] | null = null;

  constructor(public dialogRef: MatDialogRef<ViewTasksByStatusDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ViewTasksByStatusDialogData){}

  ngOnInit(): void {
    // Deep copy
    this.statusesCounts = [
      ...this.data.statusesCounts.map(({ status, color }) => ({ status, color })),
    ];
  }

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

  tasksStatuses(): TaskStatus[] {
    const keys = Object.keys(this.#tasksStatusesService.statuses) as unknown as TaskStatus[];
    return keys;
  }

  statusToLabel(status: TaskStatus) {
    return this.#tasksStatusesService.statusToLabel(status);
  }

  disableStatus(status: TaskStatus) {
    const usedStatuses = this.statusesCounts?.map(({ status }) => status.toString()) ?? [];
    return usedStatuses.includes(status.toString());
  }

  onStatusChange(index: number, status: string) {
    if (!this.statusesCounts) {
      return;
    }

    this.statusesCounts[index].status = Number(status) as TaskStatus;
  }

  onColorChange(index: number, event: Event) {
    if (!this.statusesCounts) {
      return;
    }

    const target = event.target as HTMLInputElement;
    this.statusesCounts[index].color = target.value;
  }

  onClear(count: TaskStatusColored) {
    count.status = this.#defaultStatus;
    count.color = this.#defaultColor;
  }

  onRemove(index: number) {
    this.statusesCounts?.splice(index, 1);
  }

  onAdd() {
    this.statusesCounts?.push({
      status: this.#defaultStatus,
      color: this.#defaultColor,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  drop(event: CdkDragDrop<TaskStatusColored[]>) {
    if (!this.statusesCounts) {
      return;
    }

    moveItemInArray(this.statusesCounts, event.previousIndex, event.currentIndex);
  }

  trackByStatus(_: number, status: TaskStatus) {
    return status;
  }
}
