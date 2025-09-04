import { SessionRawEnumField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard} from '@angular/cdk/clipboard';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { TaskOptions } from '@app/tasks/types';
import { GrpcAction } from '@app/types/actions.type';
import { AbstractTaskByStatusTableComponent, SelectionTable } from '@app/types/components/table';
import { ArmonikData, SessionData } from '@app/types/data';
import { GrpcActionsService } from '@app/types/services/grpc-actions.service';
import { StatusService } from '@app/types/status';
import { TableComponent } from '@components/table/table.component';
import { TableTasksByStatus, TasksByStatusService } from '@services/tasks-by-status.service';
import { Subject } from 'rxjs';
import { SessionsDataService } from '../services/sessions-data.service';
import { SessionsStatusesService } from '../services/sessions-statuses.service';
import { SessionRaw } from '../types';

@Component({
  selector: 'app-sessions-table',
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
  implements OnInit, SelectionTable<SessionRaw> {  
  readonly statusesService = inject(StatusService) as SessionsStatusesService;
  readonly router = inject(Router);
  readonly copyService = inject(Clipboard);

  readonly tableDataService = inject(SessionsDataService);
  private readonly grpcActions = inject(GrpcActionsService);

  table: TableTasksByStatus = 'sessions';

  sessionsIdsComputationError: string[] = [];

  copy$ = new Subject<SessionRaw>();
  copySubscription = this.copy$.subscribe(session => this.onCopiedSessionId(session));

  seeSessions$ = new Subject<SessionRaw>();
  seeSessionsSubscription = this.seeSessions$.subscribe(session => this.router.navigate(['/sessions', session.sessionId]));

  seeResults$ = new Subject<SessionRaw>();
  seeResultsSubscription = this.seeResults$.subscribe(session => {
    const sessionData = this.data().find((sessionData) => sessionData.raw.sessionId === session.sessionId) as SessionData;
    this.router.navigate(['/results'], { queryParams: sessionData.resultsQueryParams });
  });

  @Output() selectionChange = new EventEmitter<SessionRaw[]>();

  actions: GrpcAction<SessionRaw>[] = [
    {
      label: 'Copy session ID',
      icon: 'copy',
      click: (sessions: SessionRaw[]) => this.copy$.next(sessions[0]),
    },
    {
      label: 'See session',
      icon: 'sessions',
      click: (sessions: SessionRaw[]) => this.seeSessions$.next(sessions[0]),
    },
    {
      label: 'See results',
      icon: 'results',
      click: (sessions: SessionRaw[]) => this.seeResults$.next(sessions[0]),
    },
  ];

  ngOnInit(): void {
    this.initTableDataService();
    this.initStatuses();
    this.grpcActions.refresh = this.tableDataService.refresh$;
    this.actions.push(...this.grpcActions.actions);
  }

  onSelectionChange($event: SessionRaw[]): void {
    this.selectionChange.emit($event);
  }

  isDataRawEqual(value: SessionRaw, entry: SessionRaw): boolean {
    return value.sessionId === entry.sessionId;
  }

  onCopiedSessionId(session: SessionRaw) {
    this.copyService.copy(session.sessionId);
    this.notificationService.success('Session ID copied to clipboard');
  }

  trackBy(index: number, item: ArmonikData<SessionRaw, TaskOptions>) {
    return item.raw.sessionId;
  }
}
