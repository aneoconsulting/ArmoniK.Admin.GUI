import { SessionRawEnumField, SessionStatus, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { inject, Injectable } from '@angular/core';
import { TaskOptions } from '@app/tasks/types';
import { GrpcActionsService } from '@app/types/services/grpc-actions.service';
import { StatusService } from '@app/types/status';
import { catchError, combineLatest, Subject, switchMap } from 'rxjs';
import { SessionRaw } from '../types';
import { SessionsGrpcService } from './sessions-grpc.service';
import { SessionsStatusesService } from './sessions-statuses.service';

@Injectable()
export class SessionsGrpcActionsService extends GrpcActionsService<SessionRaw, SessionStatus, SessionRawEnumField, TaskOptions, TaskOptionEnumField> {
  protected readonly grpcService = inject(SessionsGrpcService);
  protected readonly statusesService = inject(StatusService) as SessionsStatusesService;

  pauseSession$ = new Subject<SessionRaw[]>();
  pauseSessionSubscription = this.pauseSession$.pipe(
    switchMap(sessions => combineLatest(
      sessions.map(session => 
        this.grpcService.pause$(session.sessionId).pipe(
          catchError(error => this.handleError(error, $localize`An error occured while pausing session ` + session.sessionId))
        )
      )
    ))
  ).subscribe(result => {
    const success = result.reduce((acc, session) => acc && session !== null, true);
    if (success) {
      const plural = result.length > 1 ? $localize`Sessions` : $localize`Session`;
      this.success(plural + $localize` paused`);
    }
  });

  resumeSession$ = new Subject<SessionRaw[]>();
  resumeSessionSubscription = this.resumeSession$.pipe(
    switchMap(sessions => combineLatest(
      sessions.map(session => 
        this.grpcService.resume$(session.sessionId).pipe(
          catchError(error => this.handleError(error, $localize`An error occured while resuming session ` + session.sessionId))
        )
      )
    ))
  ).subscribe(result => {
    const success = result.reduce((acc, session) => acc && session !== null, true);
    if (success) {
      const plural = result.length > 1 ? $localize`Sessions` : $localize`Session`;
      this.success(plural + $localize` resumed`);
    }
  });
  purgeSession$ = new Subject<SessionRaw[]>();
  purgeSessionSubscription = this.purgeSession$.pipe(
    switchMap(sessions => combineLatest(
      sessions.map(session => 
        this.grpcService.purge$(session.sessionId).pipe(
          catchError(error => this.handleError(error, $localize`An error occured while purging session ` + session.sessionId))
        )
      )
    ))
  ).subscribe(result => {
    const success = result.reduce((acc, session) => acc && session !== null, true);
    if (success) {
      const plural = result.length > 1 ? $localize`Sessions` : $localize`Session`;
      this.success(plural + $localize` purged`);
    }
  });

  cancelSession$ = new Subject<SessionRaw[]>();
  cancelSessionSubscription = this.cancelSession$.pipe(
    switchMap(sessions => combineLatest(
      sessions.map(session => 
        this.grpcService.cancel$(session.sessionId).pipe(
          catchError(error => this.handleError(error, $localize`An error occured while cancelling session ` + session.sessionId))
        )
      )
    ))
  ).subscribe(result => {
    const success = result.reduce((acc, session) => acc && session !== null, true);
    if (success) {
      const plural = result.length > 1 ? $localize`Sessions` : $localize`Session`;
      this.success(plural + $localize` cancelled`);
    }
  });

  closeSession$ = new Subject<SessionRaw[]>();
  closeSessionSubscription = this.closeSession$.pipe(
    switchMap(sessions => combineLatest(
      sessions.map(session => 
        this.grpcService.close$(session.sessionId).pipe(
          catchError(error => this.handleError(error, $localize`An error occured while closing session ` + session.sessionId))
        )
      )
    ))
  ).subscribe(result => {
    const success = result.reduce((acc, session) => acc && session !== null, true);
    if (success) {
      const plural = result.length > 1 ? $localize`Sessions` : $localize`Session`;
      this.success(plural + $localize` closed`);
    }
  });

  deleteSession$ = new Subject<SessionRaw[]>();
  deleteSessionSubscription = this.deleteSession$.pipe(
    switchMap(sessions => combineLatest(
      sessions.map(session => 
        this.grpcService.delete$(session.sessionId).pipe(
          catchError(error => this.handleError(error, $localize`An error occured while deleting session ` + session.sessionId))
        )
      )
    ))
  ).subscribe(result => {
    const success = result.reduce((acc, session) => acc && session !== null, true);
    if (success) {
      const plural = result.length > 1 ? $localize`Sessions` : $localize`Session`;
      this.success(plural + $localize` deleted`);
    }
  });

  constructor() {
    super();

    this.actions.push(
      {
        label: $localize`Pause session`,
        icon: 'pause',
        click: (sessions) => this.pauseSession$.next(sessions),
        condition: (sessions) => sessions.reduce((acc, session) => acc || this.statusesService.canPause(session.status), false),
        key: 'pause',
      },
      {
        label: $localize`Resume session`,
        icon: 'play',
        click: (sessions) => this.resumeSession$.next(sessions),
        condition: (sessions) => sessions.reduce((acc, session) => acc || this.statusesService.canResume(session.status), false),
        key: 'resume',
      },
      {
        label: $localize`Cancel session`,
        icon: 'cancel',
        click: (sessions) => this.cancelSession$.next(sessions),
        condition: (sessions) => sessions.reduce((acc, session) => acc || this.statusesService.canCancel(session.status), false),
      },
      {
        label: $localize`Purge session`,
        icon: 'purge',
        click: (sessions) => this.purgeSession$.next(sessions),
        condition: (sessions) => sessions.reduce((acc, session) => acc || this.statusesService.canPurge(session.status), false),
      },
      {
        label: $localize`Close session`,
        icon: 'close',
        click: (sessions) => this.closeSession$.next(sessions),
        condition: (sessions) => sessions.reduce((acc, session) => acc || this.statusesService.canClose(session.status), false),
      },
      {
        label: $localize`Delete session`,
        icon: 'delete',
        click: (sessions) => this.deleteSession$.next(sessions),
        condition: (sessions) => sessions.reduce((acc, session) => acc || this.statusesService.canDelete(session.status), false),
      }
    );
  }
}