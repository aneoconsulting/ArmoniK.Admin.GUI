import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
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
  templateUrl: './view-tasks-by-status-dialog.component.html',
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

  isUsedStatus(status: TaskStatus) {
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

  onDrop(event: CdkDragDrop<TaskStatusColored[]>) {
    if (!this.statusesCounts) {
      return;
    }

    moveItemInArray(this.statusesCounts, event.previousIndex, event.currentIndex);
  }
}