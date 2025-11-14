import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, Inject, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ManageGroupsDialogData, ManageGroupsDialogResult, TasksStatusesGroup } from '@app/dashboard/types';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { StatusLabelColor, StatusService } from '@app/types/status';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { StorageService } from '@services/storage.service';
import { AddStatusesGroupDialogComponent } from './add-statuses-group-dialog.component';
import { EditStatusesGroupDialogComponent } from './edit-status-group-dialog.component';

@Component({
  templateUrl: './manage-groups-dialog.component.html',
  styleUrl: 'manage-groups-dialog.component.scss',
  providers: [
    DefaultConfigService,
    StorageService,
    {
      provide: StatusService,
      useClass: TasksStatusesService
    },
  ],
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    DragDropModule,
    MatTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageGroupsDialogComponent {
  private readonly _groups = signal<TasksStatusesGroup[]>([]);

  get groups(): TasksStatusesGroup[] {
    return this._groups();
  }

  private readonly dialog = inject(MatDialog);
  private readonly iconsServices = inject(IconsService);
  private readonly tasksStatusesService = inject(StatusService) as TasksStatusesService;

  constructor(
    public _dialogRef: MatDialogRef<ManageGroupsDialogComponent, ManageGroupsDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: ManageGroupsDialogData,
  ) {
    this._groups.set(this.data.groups);
  }

  getIcon(name: string): string {
    return this.iconsServices.getIcon(name);
  }

  statusToLabel(status: TaskStatus): StatusLabelColor {
    return this.tasksStatusesService.statusToLabel(status);
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
    const dialogRef: MatDialogRef<AddStatusesGroupDialogComponent, TasksStatusesGroup> = this.dialog.open(AddStatusesGroupDialogComponent, {
      data: {
        statuses: this.tasksStatusesService.statuses,
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._groups.update(groups => [...groups, result]);
      }
    });
  }

  openEditStatusGroupModal(group: TasksStatusesGroup): void {
    const dialogRef: MatDialogRef<EditStatusesGroupDialogComponent, TasksStatusesGroup> = this.dialog.open(EditStatusesGroupDialogComponent, {
      data: {
        group,
        statuses: this.tasksStatusesService.statuses,
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.groups.indexOf(group);
        this._groups.update(groups => groups.map((group, i) => i === index ? result : group));
      }
    });
  }

  onDelete(group: TasksStatusesGroup): void {
    const index = this.groups.indexOf(group);
    if (index > -1) {
      this._groups.update(groups => groups.filter((group, i) => i !== index));
    }
  }

  onNoClick(): void {
    this._dialogRef.close();
  }
}
