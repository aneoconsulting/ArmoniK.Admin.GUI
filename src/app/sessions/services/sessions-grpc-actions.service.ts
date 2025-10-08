import { SessionRawEnumField, SessionStatus, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskOptions } from '@app/tasks/types';
import { GrpcActionsService } from '@app/types/services/grpc-actions.service';
import { StatusService } from '@app/types/status';
import { catchError, combineLatest, of, Subject, switchMap } from 'rxjs';
import { SessionRaw } from '../types';
import { SessionsGrpcService } from './sessions-grpc.service';
import { SessionsStatusesService } from './sessions-statuses.service';

/**
 * Service used for session index, table and inspection components to share a common configuration of their grpc-related actions.
 * 
 * Provided actions:
 * - Pause/Resume
 * - Cancel
 * - Purge
 * - Close
 * - Delete 
 */
@Injectable()
export class SessionsGrpcActionsService extends GrpcActionsService<SessionRaw, SessionStatus, SessionRawEnumField, TaskOptions, TaskOptionEnumField> {
  protected readonly grpcService = inject(SessionsGrpcService);
  protected readonly statusesService = inject(StatusService) as SessionsStatusesService;
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly pauseSession$ = new Subject<SessionRaw[]>();
  private readonly resumeSession$ = new Subject<SessionRaw[]>();
  private readonly purgeSession$ = new Subject<SessionRaw[]>();
  private readonly cancelSession$ = new Subject<SessionRaw[]>();
  private readonly closeSession$ = new Subject<SessionRaw[]>();
  private readonly deleteSession$ = new Subject<SessionRaw[]>();

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

  protected subscribeToActions(refresh?: Subject<void> | null): void {
    const deleteSessionSubscription = this.deleteSession$.pipe(
      switchMap(sessions => {
        if (sessions.length !== 0) {
          return combineLatest(
            sessions.map(session => 
              this.grpcService.delete$(session.sessionId).pipe(
                catchError(error => this.handleError(error, $localize`An error occurred while deleting session ` + session.sessionId))
              )
            )
          );
        }
        return [];
      }),
      switchMap(result => combineLatest([of(result), this.route.params])),
    ).subscribe(([result, params]) => {
      if (result.length !== 0) {
        const success = result.reduce((acc, session) => acc && session !== null, true);
        if (success) {
          if (params['id']) {
            this.router.navigate(['/sessions']);
          } else {
            const plural = result.length > 1 ? $localize`Sessions` : $localize`Session`;
            this.success(plural + $localize` deleted`);
          }
        }
        if (refresh) {
          refresh.next();
        }
      }
    });
    this.subscriptions.add(deleteSessionSubscription);

    const closeSessionSubscription = this.closeSession$.pipe(
      switchMap(sessions => {
        if (sessions.length !== 0) {
          return combineLatest(
            sessions.map(session => 
              this.grpcService.close$(session.sessionId).pipe(
                catchError(error => this.handleError(error, $localize`An error occurred while closing session ` + session.sessionId))
              )
            )
          );
        }
        return [];
      })
    ).subscribe(result => {
      if (result.length !== 0) {
        const success = result.reduce((acc, session) => acc && session !== null, true);
        if (success) {
          const plural = result.length > 1 ? $localize`Sessions` : $localize`Session`;
          this.success(plural + $localize` closed`);
        }
        if (refresh) {
          refresh.next();
        }
      }
    });
    this.subscriptions.add(closeSessionSubscription);

    const cancelSessionSubscription = this.cancelSession$.pipe(
      switchMap(sessions => {
        if (sessions.length !== 0) {
          return combineLatest(
            sessions.map(session => 
              this.grpcService.cancel$(session.sessionId).pipe(
                catchError(error => this.handleError(error, $localize`An error occurred while cancelling session ` + session.sessionId))
              )
            )
          );
        }
        return [];
      })
    ).subscribe(result => {
      if (result.length !== 0) {
        const success = result.reduce((acc, session) => acc && session !== null, true);
        if (success) {
          const plural = result.length > 1 ? $localize`Sessions` : $localize`Session`;
          this.success(plural + $localize` cancelled`);
        }
        if (refresh) {
          refresh.next();
        }
      }
    });
    this.subscriptions.add(cancelSessionSubscription);

    const purgeSessionSubscription = this.purgeSession$.pipe(
      switchMap(sessions => {
        if (sessions.length !== 0) {
          return combineLatest(
            sessions.map(session => 
              this.grpcService.purge$(session.sessionId).pipe(
                catchError(error => this.handleError(error, $localize`An error occurred while purging session ` + session.sessionId))
              )
            )
          );
        }
        return [];
      })
    ).subscribe(result => {
      if (result.length !== 0) {
        const success = result.reduce((acc, session) => acc && session !== null, true);
        if (success) {
          const plural = result.length > 1 ? $localize`Sessions` : $localize`Session`;
          this.success(plural + $localize` purged`);
        }
        if (refresh) {
          refresh.next();
        }
      }
    });
    this.subscriptions.add(purgeSessionSubscription);

    const resumeSessionSubscription = this.resumeSession$.pipe(
      switchMap(sessions => {
        if (sessions.length !== 0) {
          return combineLatest(
            sessions.map(session => 
              this.grpcService.resume$(session.sessionId).pipe(
                catchError(error => this.handleError(error, $localize`An error occurred while resuming session ` + session.sessionId))
              )
            )
          );
        }
        return [];
      })
    ).subscribe(result => {
      if (result.length !== 0) {
        const success = result.reduce((acc, session) => acc && session !== null, true);
        if (success) {
          const plural = result.length > 1 ? $localize`Sessions` : $localize`Session`;
          this.success(plural + $localize` resumed`);
        }
        if (refresh) {
          refresh.next();
        }
      }
    });
    this.subscriptions.add(resumeSessionSubscription);

    const pauseSessionSubscription = this.pauseSession$.pipe(
      switchMap(sessions => {
        if (sessions.length !== 0) {
          return combineLatest(
            sessions.map(session => 
              this.grpcService.pause$(session.sessionId).pipe(
                catchError(error => this.handleError(error, $localize`An error occurred while pausing session ` + session.sessionId))
              )
            )
          );
        }
        return [];
      })
    ).subscribe(result => {
      if (result.length !== 0) {
        const success = result.reduce((acc, session) => acc && session !== null, true);
        if (success) {
          const plural = result.length > 1 ? $localize`Sessions` : $localize`Session`;
          this.success(plural + $localize` paused`);
        }
        if (refresh) {
          refresh.next();
        }
      }
    });
    this.subscriptions.add(pauseSessionSubscription);
  }
}