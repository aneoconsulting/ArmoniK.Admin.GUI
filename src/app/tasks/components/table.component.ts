import { TaskOptionEnumField, TaskSummaryEnumField} from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard, } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { Router} from '@angular/router';
import { GrpcAction } from '@app/types/actions.type';
import { AbstractTableComponent } from '@app/types/components/table';
import { Scope } from '@app/types/config';
import { ArmonikData, TaskData } from '@app/types/data';
import { StatusService } from '@app/types/status';
import { TableComponent } from '@components/table/table.component';
import { Subject } from 'rxjs';
import TasksDataService from '../services/tasks-data.service';
import { TasksGrpcActionsService } from '../services/tasks-grpc-actions.service';
import { TasksStatusesService } from '../services/tasks-statuses.service';
import { TaskOptions, TaskSummary } from '../types';

@Component({
  selector: 'app-tasks-table',
  templateUrl: './table.component.html',
  providers: [
    Clipboard,
  ],
  imports: [
    TableComponent
  ]
})
export class TasksTableComponent extends AbstractTableComponent<TaskSummary, TaskSummaryEnumField, TaskOptions, TaskOptionEnumField> implements OnInit {
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
  @Output() selectionChange = new EventEmitter<TaskSummary[]>();

  readonly tableDataService = inject(TasksDataService);
  readonly router = inject(Router);
  readonly clipboard = inject(Clipboard);
  readonly tasksStatusesService = inject(StatusService) as TasksStatusesService;
  private readonly grpcActionsService = inject(TasksGrpcActionsService);

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

  copy$ = new Subject<TaskSummary>();
  copyS = this.copy$.subscribe((task) => this.onCopiedTaskId(task));

  seeResult$ = new Subject<TaskSummary>();
  resultSubscription = this.seeResult$.subscribe((task) => {
    const taskData = this.data().find(taskData => taskData.raw.id === task.id) as TaskData;
    this.router.navigate(['/results'], { queryParams: taskData.resultsQueryParams });
  });

  retries$ = new Subject<TaskSummary>();
  retriesSubscription = this.retries$.subscribe((task) => this.onRetries(task));

  openViewInLogs$ = new Subject<TaskSummary>();
  openViewInLogsSubscription = this.openViewInLogs$.subscribe((task) => window.open(this.generateViewInLogsUrl(task.id), '_blank'));
  
  actions: GrpcAction<TaskSummary>[] = [
    {
      label: $localize`Copy Task ID`,
      icon: 'copy',
      click: (tasks: TaskSummary[]) => this.copy$.next(tasks[0]),
    },
    {
      label: $localize`See related result`,
      icon: 'view',
      click: (tasks: TaskSummary[]) => this.seeResult$.next(tasks[0]),
    },
    {
      label: $localize`Retries`,
      icon: 'published_with_changes',
      click: (tasks: TaskSummary[]) => this.retries$.next(tasks[0]),
      condition: (tasks: TaskSummary[]) => this.isRetried(tasks[0]),
    },
  ];

  ngOnInit(): void {
    this.initTableDataService();
    this.actions.push(...this.grpcActionsService.actions);
  }

  isDataRawEqual(value: TaskSummary, entry: TaskSummary): boolean {
    return value.id === entry.id;
  }

  onCopiedTaskId(task: TaskSummary) {
    this.clipboard.copy(task.id);
    this.notificationService.success('Task ID copied to clipboard');
  }

  isRetried(task: TaskSummary): boolean {
    return this.tasksStatusesService.isRetried(task.status);
  }

  onRetries(task: TaskSummary) {
    this.retries.emit(task);
  }

  onSelectionChange($event: TaskSummary[]): void {
    this.selectionChange.emit($event);
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
        console.log(this._serviceIcon);
        this.actions[4] = {
          ...this.actions[4],
          label: this._serviceName,
          icon: this._serviceIcon,
        };
      } else {
        this.actions.push({
          label: this._serviceName,
          icon: this._serviceIcon,
          click: (tasks: TaskSummary[]) => this.openViewInLogs$.next(tasks[0]),
        });
      }
    }
  }

  trackBy(index: number, item: ArmonikData<TaskSummary, TaskOptions>) {
    return item.raw.id;
  }
}