import { FilterStringOperator, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApplicationRaw } from '@app/applications/types';
import { TaskSummaryFiltersOr } from '@app/tasks/types';
import { TaskStatusColored, ViewTasksByStatusDialogData } from '@app/types/dialog';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { ViewTasksByStatusDialogComponent } from '@components/view-tasks-by-status-dialog.component';
import { IconsService } from '@services/icons.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';

@Component({
  selector: 'app-application-status-group-card',
  template: `
<table mat-table [dataSource]="data" recycleRows>
  <ng-container *ngFor="let column of displayedColumns" [matColumnDef]="column">
    <th mat-header-cell *matHeaderCellDef appNoWrap >
      <div class="column-label">
        {{ getColumnLabel(column) }}
        <button class="button-display" mat-icon-button *ngIf="column === 'statuses'" (click)="personalizeTasksByStatus()" i18n-matTooltip matTooltip="Personnalize tasks by status">
          <mat-icon aria-hidden="true" [fontIcon]="getIcon('tune')"></mat-icon>
        </button>
      </div>
    </th>
    <ng-container *ngIf="column === 'name'">
      <td mat-cell *matCellDef="let element">{{element.name}}</td>
    </ng-container>

    <!-- Statuses -->
    <ng-container *ngIf="column === 'statuses'">
      <td mat-cell *matCellDef="let element" appNoWrap>
        <app-count-tasks-by-status
        [statuses]="tasksStatusesColored"
        [queryParams]="createTasksByStatusQueryParams(element.name, element.version)"
        [filters]="countTasksByStatusFilters(element.name, element.version)"
      ></app-count-tasks-by-status>
      </td>
    </ng-container>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>
  `,
  styles: [`
.column-label {
  display: flex;
  align-items: center;
}
  `],
  standalone: true,
  providers: [
    TasksByStatusService,
    IconsService,
    MatDialog
  ],
  imports: [
    MatCardModule,
    MatTableModule,
    CountTasksByStatusComponent,
    NgIf,
    NgFor,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class ApplicationStatusGroupCardComponent implements OnInit {
  @Input({required: true}) data: ApplicationRaw[];
  tasksStatusesColored: TaskStatusColored[] = [];
  displayedColumns = ['name', 'statuses'];
  
  #tasksByStatusService = inject(TasksByStatusService);
  #iconsService = inject(IconsService);
  readonly #dialog = inject(MatDialog);

  ngOnInit(): void {
    this.tasksStatusesColored = this.#tasksByStatusService.restoreStatuses('applications');
  }

  getColumnLabel(column: string) {
    switch (column) {
    case 'name':
      return $localize`Application`;
    case 'statuses':
      return $localize`Tasks by Status`;
    default:
      return '';
    }
  }

  countTasksByStatusFilters(applicationName: string, applicationVersion: string): TaskSummaryFiltersOr {
    return [
      [
        {
          for: 'options',
          field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME,
          value: applicationName,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL
        },
        {
          for: 'options',
          field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION,
          value: applicationVersion,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL
        }
      ]
    ];
  }

  createTasksByStatusQueryParams(name: string, version: string) {
    return {
      [`0-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`]: name,
      [`0-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`]: version,
    };
  }

  getIcon(name: string) {
    return this.#iconsService.getIcon(name);
  }

  personalizeTasksByStatus() {
    const dialogRef = this.#dialog.open<ViewTasksByStatusDialogComponent, ViewTasksByStatusDialogData>(ViewTasksByStatusDialogComponent, {
      data: {
        statusesCounts: this.tasksStatusesColored,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.tasksStatusesColored = result;
      this.#tasksByStatusService.saveStatuses('applications', result);
    });
  }
}
