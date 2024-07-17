import { FilterStringOperator, ListTasksResponse, ResultRawEnumField, TaskOptionEnumField, TaskSummaryEnumField} from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard, } from '@angular/cdk/clipboard';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router} from '@angular/router';
import { Subject } from 'rxjs';
import { AbstractTableComponent } from '@app/types/components/table';
import { Scope } from '@app/types/config';
import { ArmonikData, TaskData } from '@app/types/data';
import { Filter } from '@app/types/filters';
import { ActionTable } from '@app/types/table';
import { TableComponent } from '@components/table/table.component';
import { FiltersService } from '@services/filters.service';
import { GrpcSortFieldService } from '@services/grpc-sort-field.service';
import { TasksGrpcService } from '../services/tasks-grpc.service';
import { TasksIndexService } from '../services/tasks-index.service';
import { TasksStatusesService } from '../services/tasks-statuses.service';
import { TaskSummary, TaskSummaryColumnKey, TaskSummaryFieldKey, TaskSummaryListOptions } from '../types';

@Component({
  selector: 'app-tasks-table',
  standalone: true,
  templateUrl: './table.component.html',
  providers: [
    MatDialog,
    FiltersService,
    Clipboard,
    TasksGrpcService,
    GrpcSortFieldService,
  ],
  imports: [
    TableComponent
  ]
})
export class TasksTableComponent extends AbstractTableComponent<TaskSummary, TaskSummaryColumnKey, TaskSummaryFieldKey, TaskSummaryListOptions, TaskSummaryEnumField, TaskOptionEnumField>
  implements OnInit, AfterViewInit {
  scope: Scope = 'tasks';

  @Input({ required: false }) set serviceIcon(entry: string | null) {
    if (entry) {
      this._serviceIcon = entry;
      this.addService();
    }
  }
  @Input({ required: false }) set serviceName(entry: string | null) {
    if (entry) {
      this._serviceName = entry;
      this.addService();
    }
  }
  @Input({ required: false }) set urlTemplate(entry: string | null) {
    if (entry) {
      this._urlTemplate = entry;
      this.addService();
    }
  }

  @Output() retries = new EventEmitter<TaskSummary>();
  @Output() cancelTask = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<string[]>();

  readonly indexService = inject(TasksIndexService);
  readonly grpcService = inject(TasksGrpcService);
  readonly router = inject(Router);
  readonly clipboard = inject(Clipboard);
  readonly tasksStatusesService = inject(TasksStatusesService);

  private _serviceIcon: string = '';
  private _serviceName: string = '';
  private _urlTemplate: string = '';

  get serviceIcon(): string {
    return this._serviceIcon;
  }

  get serviceName(): string {
    return this._serviceName;
  }

  get urlTemplate(): string {
    return this._urlTemplate;
  }

  selection: string[];

  copy$ = new Subject<TaskData>();
  copyS = this.copy$.subscribe((data) => this.onCopiedTaskId(data as TaskData));

  seeResult$ = new Subject<TaskData>();
  resultSubscription = this.seeResult$.subscribe((data) => this.router.navigate(['/results'], { queryParams: data.resultsQueryParams }));

  retries$ = new Subject<TaskData>();
  retriesSubscription = this.retries$.subscribe((data) => this.onRetries(data.raw));

  cancelTask$ = new Subject<TaskData>();
  cancelTaskSubscription = this.cancelTask$.subscribe((data) => this.onCancelTask(data.raw.id));

  openViewInLogs$ = new Subject<TaskData>();
  openViewInLogsSubscription = this.openViewInLogs$.subscribe((data) => window.open(this.generateViewInLogsUrl(data.raw.id), '_blank'));
  
  actions: ActionTable<TaskData>[] = [
    {
      label: $localize`Copy Task ID`,
      icon: 'copy',
      action$: this.copy$,
    },
    {
      label: $localize`See related result`,
      icon: 'view',
      action$: this.seeResult$,
    },
    {
      label: $localize`Retries`,
      icon: 'published_with_changes',
      action$: this.retries$,
      condition: (element: TaskData) => this.isRetried(element.raw),
    },
    {
      label: $localize`Cancel task`,
      icon: 'cancel',
      action$: this.cancelTask$,
      condition: (element: TaskData) => this.canCancelTask(element.raw),
    },
  ];

  ngOnInit(): void {
    this.initTable();
  }

  ngAfterViewInit(): void {
    this.subscribeToData();
  }

  computeGrpcData(entries: ListTasksResponse): TaskSummary[] | undefined {
    return entries.tasks;
  }

  isDataRawEqual(value: TaskSummary, entry: TaskSummary): boolean {
    return value.id === entry.id;
  }

  createNewLine(entry: TaskSummary): TaskData {
    return {
      raw: entry,
      resultsQueryParams: this.createResultsQueryParams(entry.id),
    };
  }

  createResultsQueryParams(taskId: string) {
    if (this.filters.length === 0) {
      const keyTask = this.filtersService.createQueryParamsKey<ResultRawEnumField>(1, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID);

      return {
        [keyTask]: taskId
      };
    } else {
      const params: Record<string, string> = {};
      this.filters.forEach((filterAnd, index) => {
        filterAnd.forEach(filter => {
          if (!(filter.field === TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID && filter.operator === FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL)) {
            const filterLabel = this.#createResultFilterLabel(filter, index);
            if (filterLabel && filter.value) params[filterLabel] = filter.value.toString();
          }
        });
        params[`${index}-root-${ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`] = taskId;
      });
      return params;
    }
  }

  #createResultFilterLabel(filter: Filter<TaskSummaryEnumField, TaskOptionEnumField>, orGroup: number) {
    if (filter.field !== null && filter.operator !== null) {
      if (filter.field === TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID) {
        return this.filtersService.createQueryParamsKey<ResultRawEnumField>(orGroup, 'root', filter.operator, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID);
      } else if (filter.field === TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID) {
        return this.filtersService.createQueryParamsKey<ResultRawEnumField>(orGroup, 'root', filter.operator, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID);
      }
    }
    return null;
  }

  onCopiedTaskId(element: TaskData) {
    this.clipboard.copy(element.raw.id);
    this.notificationService.success('Task ID copied to clipboard');
  }

  isRetried(task: TaskSummary): boolean {
    return this.tasksStatusesService.isRetried(task.status);
  }

  canCancelTask(task: TaskSummary): boolean {
    return this.tasksStatusesService.taskNotEnded(task.status);
  }

  onRetries(task: TaskSummary) {
    this.retries.emit(task);
  }

  onCancelTask(id: string) {
    this.grpcService.cancel$([id]).subscribe(() => this.notificationService.success('Task canceled'));
  }

  onSelectionChange($event: TaskSummary[]): void {
    this.selectionChange.emit($event.map(task => task.id));
  }

  generateViewInLogsUrl(taskId: string): string {
    if (!this.urlTemplate) {
      return '';
    }

    return this.urlTemplate.replaceAll('%taskId', taskId);
  }

  addService() {
    if (this._serviceIcon !== '' && this._serviceName !== '' && this._urlTemplate !== '') {
      if (this.actions[4]) {
        this.actions[4] = {
          label: this._serviceName,
          icon: this._serviceIcon,
          action$: this.openViewInLogs$,
        };
      } else {
        this.actions.push({
          label: this._serviceName,
          icon: this._serviceIcon,
          action$: this.openViewInLogs$,
        });
      }
    }
  }

  trackBy(index: number, item: ArmonikData<TaskSummary>) {
    return item.raw.id;
  }
}