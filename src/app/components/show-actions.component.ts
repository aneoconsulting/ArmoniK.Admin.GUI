import { FilterStringOperator, PartitionRawEnumField, ResultRawEnumField, SessionRaw, SessionRawEnumField, SessionStatus, TaskOptionEnumField, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { PartitionRaw } from '@app/partitions/types';
import { ResultRaw } from '@app/results/types';
import { TaskRaw } from '@app/tasks/types';
import { DataRaw } from '@app/types/data';
import { Page } from '@app/types/pages';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-show-actions',
  templateUrl: './show-actions.component.html',
  styles: [`
  .spacer {
    flex: 1 1 auto;
  }
  .smallSpace {
    margin-left: 5px;
    margin-right: 5px;
  }
  `],
  standalone: true,
  imports: [
    NgIf,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatToolbarModule
  ],
  providers: [
    IconsService,
    FiltersService
  ]
})
export class ShowActionsComponent {
  @Input({ required: true }) type: Page;
  @Input({ required: true }) data: DataRaw = {} as DataRaw;
  @Output() cancel = new EventEmitter<never>();
  @Output() refresh = new EventEmitter<never>();

  _iconsService = inject(IconsService);
  _filtersService = inject(FiltersService);

  get sessionActions(): boolean {
    return this.type === 'sessions';
  }

  get taskActions(): boolean {
    return this.type === 'tasks';
  }

  get resultActions(): boolean {
    return this.type === 'results';
  }

  get partitionActions(): boolean {
    return this.type === 'partitions';
  }

  get prettyType() {
    const pretty = this.type.slice(0, -1);
    return pretty.charAt(0).toLocaleUpperCase() + pretty.slice(1);
  }

  ownerSessionId() {
    return (this.data as TaskRaw | ResultRaw).sessionId;
  }

  resultTaskId() {
    return (this.data as ResultRaw).ownerTaskId;
  }

  taskPartition() {
    return (this.data as TaskRaw).options?.partitionId;
  }

  hasOptions() {
    return !!(this.data as TaskRaw | SessionRaw).options;
  }

  getPageIcon(name: Page): string {
    return this._iconsService.getPageIcon(name);
  }

  getIcon(name: string): string {
    return this._iconsService.getIcon(name);
  }

  resultTaskIdQueryParams() {
    const keyTask = this._filtersService.createQueryParamsKey<ResultRawEnumField>(1, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID);

    return {
      [keyTask]: (this.data as TaskRaw).id
    };
  }

  sessionsTaskResultQueryParams() {
    const keyTask = this._filtersService.createQueryParamsKey<SessionRawEnumField>(1, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID);

    return {
      [keyTask]: (this.data as SessionRaw).sessionId
    };
  }

  sessionPartitionsQueryParams() {
    const params: { [key: string]: string} = {};
    (this.data as SessionRaw).partitionIds.forEach((partitionId, index) => params[this.#createQueryParamKeyOr(index)] = partitionId);
    return params;
  }

  #createQueryParamKeyOr(orGroup: number): string {
    return this._filtersService.createQueryParamsKey<PartitionRawEnumField>(orGroup, 'root' , FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID);
  }

  partitionSessionsQueryParam() {
    const keyTask = this._filtersService.createQueryParamsKey<SessionRawEnumField>(1, 'root' , FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, SessionRawEnumField.SESSION_RAW_ENUM_FIELD_PARTITION_IDS);
  
    return {
      [keyTask]: (this.data as PartitionRaw).id
    };
  }

  partitionTasksQueryParam() {
    const keyTask = this._filtersService.createQueryParamsKey<TaskOptionEnumField>(1, 'options' , FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID);
 
    return {
      [keyTask]: (this.data as PartitionRaw).id
    };
  }

  onCancel() {
    this.cancel.emit();
  }

  onRefreshClick() {
    this.refresh.emit();
  }

  taskNotEnded() {
    return (this.data as TaskRaw).status !== TaskStatus.TASK_STATUS_SUBMITTED && (this.data as TaskRaw).status !== TaskStatus.TASK_STATUS_CREATING
    && (this.data as TaskRaw).status !== TaskStatus.TASK_STATUS_DISPATCHED && (this.data as TaskRaw).status !== TaskStatus.TASK_STATUS_PROCESSING 
    && (this.data as TaskRaw).status !== TaskStatus.TASK_STATUS_PROCESSED && (this.data as TaskRaw).status !== TaskStatus.TASK_STATUS_RETRIED 
    && (this.data as TaskRaw).status !== TaskStatus.TASK_STATUS_UNSPECIFIED;
  }

  sessionNotEnded() {
    return (this.data as SessionRaw).status !== SessionStatus.SESSION_STATUS_RUNNING;
  }
}