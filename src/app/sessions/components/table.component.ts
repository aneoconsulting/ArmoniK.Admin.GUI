import { SessionRawEnumField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard} from '@angular/cdk/clipboard';
import { Component, OnInit, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { TaskOptions } from '@app/tasks/types';
import { AbstractTaskByStatusTableComponent } from '@app/types/components/table';
import { ArmonikData, SessionData } from '@app/types/data';
import { StatusService } from '@app/types/status';
import { ActionTable } from '@app/types/table';
import { TableComponent } from '@components/table/table.component';
import { TableTasksByStatus, TasksByStatusService } from '@services/tasks-by-status.service';
import { Subject } from 'rxjs';
import { SessionsDataService } from '../services/sessions-data.service';
import { SessionsStatusesService } from '../services/sessions-statuses.service';
import { SessionRaw } from '../types';

@Component({
  selector: 'app-sessions-table',
  standalone: true,
  templateUrl: './table.component.html',
  providers: [
    TasksByStatusService,
    Clipboard,
  ],
  imports: [
    TableComponent,
    RouterModule,
    MatDialogModule,
  ]
})
export class SessionsTableComponent extends AbstractTaskByStatusTableComponent<SessionRaw, SessionRawEnumField, TaskOptions, TaskOptionEnumField>
  implements OnInit {  
  readonly statusesService = inject(StatusService) as SessionsStatusesService;
  readonly router = inject(Router);
  readonly copyService = inject(Clipboard);

  readonly tableDataService = inject(SessionsDataService);

  table: TableTasksByStatus = 'sessions';

  sessionsIdsComputationError: string[] = [];

  copy$ = new Subject<ArmonikData<SessionRaw, TaskOptions>>();
  copySubscription = this.copy$.subscribe(data => this.onCopiedSessionId(data));

  seeSessions$ = new Subject<ArmonikData<SessionRaw, TaskOptions>>();
  seeSessionsSubscription = this.seeSessions$.subscribe(data => this.router.navigate(['/sessions', data.raw.sessionId]));

  seeResults$ = new Subject<ArmonikData<SessionRaw, TaskOptions>>();
  seeResultsSubscription = this.seeResults$.subscribe(data => this.router.navigate(['/results'], { queryParams: (data as SessionData).resultsQueryParams }));

  pauseSession$ = new Subject<ArmonikData<SessionRaw, TaskOptions>>();
  pauseSessionSubscription = this.pauseSession$.subscribe(data => this.onPause(data.raw.sessionId));

  resumeSession$ = new Subject<ArmonikData<SessionRaw, TaskOptions>>();
  resumeSessionSubscription = this.resumeSession$.subscribe(data => this.onResume(data.raw.sessionId));

  purgeSession$ = new Subject<ArmonikData<SessionRaw, TaskOptions>>();
  purgeSessionSubscription = this.purgeSession$.subscribe(data => this.onPurge(data.raw.sessionId));

  cancelSession$ = new Subject<ArmonikData<SessionRaw, TaskOptions>>();
  cancelSessionSubscription = this.cancelSession$.subscribe(data => this.onCancel(data.raw.sessionId));

  closeSession$ = new Subject<ArmonikData<SessionRaw, TaskOptions>>();
  closeSessionSubscription = this.closeSession$.subscribe(data => this.onClose(data.raw.sessionId));

  deleteSession$ = new Subject<ArmonikData<SessionRaw, TaskOptions>>();
  deleteSessionSubscription = this.deleteSession$.subscribe(data => this.onDelete(data.raw.sessionId));

  actions: ActionTable<SessionRaw, TaskOptions>[] = [
    {
      label: 'Copy session ID',
      icon: 'copy',
      action$: this.copy$,
    },
    {
      label: 'See session',
      icon: 'sessions',
      action$: this.seeSessions$,
    },
    {
      label: 'See results',
      icon: 'results',
      action$: this.seeResults$,
    },
    {
      label: 'Pause session',
      icon: 'pause',
      action$: this.pauseSession$,
      condition: (element: ArmonikData<SessionRaw, TaskOptions>) => this.statusesService.canPause(element.raw.status)
    },
    {
      label: 'Resume session',
      icon: 'play',
      action$: this.resumeSession$,
      condition: (element: ArmonikData<SessionRaw, TaskOptions>) => this.statusesService.canResume(element.raw.status)
    },
    {
      label: 'Cancel session',
      icon: 'cancel',
      action$: this.cancelSession$,
      condition: (element: ArmonikData<SessionRaw, TaskOptions>) => this.statusesService.canCancel(element.raw.status)
    },
    {
      label: 'Purge session',
      icon: 'purge',
      action$: this.purgeSession$,
      condition: (element: ArmonikData<SessionRaw, TaskOptions>) => this.statusesService.canPurge(element.raw.status)
    },
    {
      label: 'Close session',
      icon: 'close',
      action$: this.closeSession$,
      condition: (element: ArmonikData<SessionRaw, TaskOptions>) => this.statusesService.canClose(element.raw.status)
    },
    {
      label: 'Delete session',
      icon: 'delete',
      action$: this.deleteSession$,
      condition: (element: ArmonikData<SessionRaw, TaskOptions>) => this.statusesService.canDelete(element.raw.status)
    }
  ];

  ngOnInit(): void {
    this.initTableDataService();
    this.initStatuses();
  }

  isDataRawEqual(value: SessionRaw, entry: SessionRaw): boolean {
    return value.sessionId === entry.sessionId;
  }

  onCopiedSessionId(data: ArmonikData<SessionRaw, TaskOptions>) {
    this.copyService.copy(data.raw.sessionId);
    this.notificationService.success('Session ID copied to clipboard');
  }

  onPause(sessionId: string) {
    this.tableDataService.onPause(sessionId);
  }

  onResume(sessionId: string) {
    this.tableDataService.onResume(sessionId);
  }

  onCancel(sessionId: string) {
    this.tableDataService.onCancel(sessionId);
  }

  onPurge(sessionId: string) {
    this.tableDataService.onPurge(sessionId);
  }

  onClose(sessionId: string) {
    this.tableDataService.onClose(sessionId);
  }

  onDelete(sessionId: string) {
    this.tableDataService.onDelete(sessionId);
  }

  trackBy(index: number, item: ArmonikData<SessionRaw, TaskOptions>) {
    return item.raw.sessionId;
  }
}
