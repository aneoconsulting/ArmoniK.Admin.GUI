import { TaskOptionEnumField, TaskSummaryEnumField} from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard, } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router} from '@angular/router';
import { AbstractTableComponent } from '@app/types/components/table';
import { Scope } from '@app/types/config';
import { ArmonikData, TaskData } from '@app/types/data';
import { ActionTable } from '@app/types/table';
import { TableComponent } from '@components/table/table.component';
import { Subject } from 'rxjs';
import TasksDataService from '../services/tasks-data.service';
import { TasksStatusesService } from '../services/tasks-statuses.service';
import { TaskOptions, TaskSummary } from '../types';

@Component({
  selector: 'app-tasks-table',
  standalone: true,
  templateUrl: './table.component.html',
  providers: [
    Clipboard,
  ],
  imports: [
    TableComponent
  ]
})
export class TasksTableComponent extends AbstractTableComponent<TaskSummary, TaskSummaryEnumField, TaskOptions, TaskOptionEnumField> {
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

  readonly tableDataService = inject(TasksDataService);
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

  copy$ = new Subject<ArmonikData<TaskSummary, TaskOptions>>();
  copyS = this.copy$.subscribe((data) => this.onCopiedTaskId(data));

  seeResult$ = new Subject<ArmonikData<TaskSummary, TaskOptions>>();
  resultSubscription = this.seeResult$.subscribe((data) => this.router.navigate(['/results'], { queryParams: (data as TaskData).resultsQueryParams }));

  retries$ = new Subject<ArmonikData<TaskSummary, TaskOptions>>();
  retriesSubscription = this.retries$.subscribe((data) => this.onRetries(data.raw));

  cancelTask$ = new Subject<ArmonikData<TaskSummary, TaskOptions>>();
  cancelTaskSubscription = this.cancelTask$.subscribe((data) => this.onCancelTask(data.raw.id));

  openViewInLogs$ = new Subject<ArmonikData<TaskSummary, TaskOptions>>();
  openViewInLogsSubscription = this.openViewInLogs$.subscribe((data) => window.open(this.generateViewInLogsUrl(data.raw.id), '_blank'));
  
  actions: ActionTable<TaskSummary, TaskOptions>[] = [
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
      condition: (element: ArmonikData<TaskSummary, TaskOptions>) => this.isRetried(element.raw),
    },
    {
      label: $localize`Cancel task`,
      icon: 'cancel',
      action$: this.cancelTask$,
      condition: (element: ArmonikData<TaskSummary, TaskOptions>) => this.canCancelTask(element.raw),
    },
  ];

  isDataRawEqual(value: TaskSummary, entry: TaskSummary): boolean {
    return value.id === entry.id;
  }

  onCopiedTaskId(element: ArmonikData<TaskSummary, TaskOptions>) {
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

  onCancelTask(taskId: string) {
    this.tableDataService.cancelTask(taskId);
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

  trackBy(index: number, item: ArmonikData<TaskSummary, TaskOptions>) {
    return item.raw.id;
  }
}