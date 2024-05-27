import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ManageGroupsDialogData, ManageGroupsDialogResult, TasksStatusesGroup } from '@app/dashboard/types';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { ActionsToolbarGroupComponent } from '@components/actions-toolbar-group.component';
import { ActionsToolbarComponent } from '@components/actions-toolbar.component';
import { IconsService } from '@services/icons.service';
import { AddStatusesGroupDialogComponent } from './add-statuses-group-dialog.component';
import { EditStatusesGroupDialogComponent } from './edit-status-group-dialog.component';

@Component({
  templateUrl: './manage-groups-dialog.component.html',
  styles: [`
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.groups {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2rem;
}

.groups ul {
  min-height: 2rem;
}

.groups ul li {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;

  padding: 0.5rem;
  border-radius: 0.5rem;
}

.addGroup {
  display: flex;
  justify-content: center;
  align-items: center;
}

.addGroup button {
  display: flex;
  flex-direction: column;
  min-height: 5rem;
  width: 80%;
}

.addGroup button mat-icon {
  transform: scale(1.5);
  margin: 0 !important;
  margin-top: 0.5rem !important;
}

.groups ul li mat-icon {
  cursor: move;
}

.group-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.group-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 500;
}

.group-header-actions {
  display: flex;
  gap: 0.5rem;
}

.cdk-drag-preview {
  font-size: 1rem;

  list-style: none;
  padding: 0 0.5rem;
  border-radius: 0.5rem;

  display: flex;
  flex-direction: row;
  align-items: center;

  gap: 0.5rem;

  color: rgba(0, 0, 0, 0.6);
}

.cdk-drag-placeholder {
  opacity: 0;
}

.cdk-drag-animating {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
}

.groups ul.cdk-drop-list-dragging li:not(.cdk-drag-placeholder) {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
}
  `],
  standalone: true,
  providers: [
    TasksStatusesService,
  ],
  imports: [
    ActionsToolbarComponent,
    ActionsToolbarGroupComponent,
    NgFor,
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    DragDropModule,
    MatTooltipModule,
  ]
})
export class ManageGroupsDialogComponent implements OnInit {
  groups: TasksStatusesGroup[] = [];

  #dialog = inject(MatDialog);
  #iconsServices = inject(IconsService);
  #tasksStatusesService = inject(TasksStatusesService);

  constructor(
    public _dialogRef: MatDialogRef<ManageGroupsDialogComponent, ManageGroupsDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: ManageGroupsDialogData,
  ) {}

  ngOnInit(): void {
    this.groups = this.data.groups;
  }

  getIcon(name: string): string {
    return this.#iconsServices.getIcon(name);
  }

  statusToLabel(status: TaskStatus): string {
    return this.#tasksStatusesService.statusToLabel(status);
  }

  onDrop(event: CdkDragDrop<TaskStatus[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  openAddStatusGroupModal(): void {
    const dialogRef: MatDialogRef<AddStatusesGroupDialogComponent, TasksStatusesGroup> = this.#dialog.open(AddStatusesGroupDialogComponent, {
      data: {
        statuses: this.#tasksStatusesService.statusesRecord(),
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.groups.push(result);
      }
    });
  }

  openEditStatusGroupModal(group: TasksStatusesGroup): void {
    const dialogRef: MatDialogRef<EditStatusesGroupDialogComponent, TasksStatusesGroup> = this.#dialog.open(EditStatusesGroupDialogComponent, {
      data: {
        group,
        statuses: this.#tasksStatusesService.statusesRecord(),
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.groups.indexOf(group);
        if (index > -1) {
          this.groups[index] = result;
        }
      }
    });
  }

  onDelete(group: TasksStatusesGroup): void {
    const index = this.groups.indexOf(group);
    if (index > -1) {
      this.groups.splice(index, 1);
    }
  }

  onNoClick(): void {
    this._dialogRef.close();
  }
}
