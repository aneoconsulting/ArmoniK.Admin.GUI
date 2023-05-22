import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ManageGroupsDialogData, TasksStatusGroup } from '@app/dashboard/types';
import { ActionsToolbarGroupComponent } from '@components/actions-toolbar-group.component';
import { ActionsToolbarComponent } from '@components/actions-toolbar.component';
import { StorageService } from '@services/storage.service';
import { AddStatusesGroupDialogComponent } from './add-statuses-group-dialog.component';
import { EditStatusesGroupDialogComponent } from './edit-status-group-dialog.component';
import { DashboardIndexService } from '../services/dashboard-index.service';
import { DashboardStorageService } from '../services/dashboard-storage.service';

@Component({
  template: `
<h2 mat-dialog-title>Manage Groups</h2>

<mat-dialog-content>
  <mat-toolbar>
    <app-actions-toolbar>
      <app-actions-toolbar-group>
        <button mat-stroked-button (click)="openAddStatusGroupModal()">
          <mat-icon aria-hidden="true" fontIcon="add"></mat-icon>
          <span>Add a group</span>
        </button>
      </app-actions-toolbar-group>
    </app-actions-toolbar>
  </mat-toolbar>

  <ul class="groups" cdkDropListGroup>
    <li *ngFor="let group of groups">
      <div class="group-header">
        <h3 [style]="'color:' + group.color">
          {{ group.name }}
        </h3>
        <div class="group-header-actions">
          <button mat-icon-button (click)="openEditStatusGroupModal(group)" [attr.aria-label]="'Edit the group ' + group.name">
            <mat-icon  fontIcon="edit"></mat-icon>
          </button>
          <button mat-icon-button (click)="onDelete(group)" [attr.aria-label]="'Delete the group ' + group.name">
            <mat-icon fontIcon="delete"></mat-icon>
          </button>
        </div>
      </div>
      <ul cdkDropList
          (cdkDropListDropped)="drop($event)"
          [cdkDropListData]="group.status"
        >
        <li *ngFor="let status of group.status" cdkDrag>
          <mat-icon aria-hidden="true" fontIcon="drag_indicator"></mat-icon>
          <span>{{ getStatusLabel(status) }}</span>
        </li>
      </ul>
    </li>
  </ul>
</mat-dialog-content>

<mat-dialog-actions align="end">
  <button mat-button (click)="onNoClick()"> Cancel </button>
  <button mat-flat-button [mat-dialog-close]="groups" color="primary"> Confirm </button>
</mat-dialog-actions>
  `,
  styles: [`
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.groups {
  margin-top: 1rem;

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

  color: rgba(255, 255, 255, 0.6);
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
    StorageService,
    DashboardStorageService,
    DashboardIndexService
  ],
  imports: [
    ActionsToolbarComponent,
    ActionsToolbarGroupComponent,
    NgFor,
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    DragDropModule
  ]
})
export class ManageGroupsDialogComponent implements OnInit {
  groups: TasksStatusGroup[] = [];

  #dialog = inject(MatDialog);
  #dashboardIndexService = inject(DashboardIndexService);

  constructor(
    public _dialogRef: MatDialogRef<ManageGroupsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ManageGroupsDialogData,
  ) {}

  ngOnInit(): void {
    this.groups = [...this.data.groups.map(group => {
      return {
        ...group,
        status: [...group.status]
      };
    })
    ];
  }

  getStatusLabel(status: TaskStatus): string {
    return this.#dashboardIndexService.getStatusLabel(status);
  }

  drop(event: CdkDragDrop<TaskStatus[]>) {
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
    const dialogRef: MatDialogRef<AddStatusesGroupDialogComponent, TasksStatusGroup> = this.#dialog.open(AddStatusesGroupDialogComponent, {
      data: {
        statuses: this.#dashboardIndexService.statuses(),
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.groups.push(result);
      }
    });
  }

  openEditStatusGroupModal(group: TasksStatusGroup): void {
    const dialogRef: MatDialogRef<EditStatusesGroupDialogComponent, TasksStatusGroup> = this.#dialog.open(EditStatusesGroupDialogComponent, {
      data: {
        group,
        statuses: this.#dashboardIndexService.statuses(),
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

  onDelete(group: TasksStatusGroup): void {
    const index = this.groups.indexOf(group);
    if (index > -1) {
      this.groups.splice(index, 1);
    }
  }

  onNoClick(): void {
    this._dialogRef.close();
  }
}
