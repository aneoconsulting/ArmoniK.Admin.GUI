import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import {
  BehaviorSubject,
  concatMap,
  distinctUntilChanged,
  first,
  map,
  Observable,
  Subject,
  switchMap,
  takeWhile,
  tap,
} from 'rxjs';
import { GrpcPagerService, GrpcSessionsService } from '../../../core';
import { ListSessionsResponse } from '../../../core/types/proto/sessions-common.pb';

@Component({
  selector: 'app-pages-sessions-list',
  templateUrl: './sessions-list.component.html',
  styleUrls: ['./sessions-list.component.scss'],
})
export class SessionsListComponent {
  private _state: ClrDatagridStateInterface = {};

  trigger$ = new Subject<ClrDatagridStateInterface>();

  loadingSessions$ = new BehaviorSubject<boolean>(true);
  totalSessions$ = new BehaviorSubject<number>(0);

  loadSessions$ = this.trigger$.pipe(
    tap(() => this.loadingSessions$.next(true)),
    map((state) => this._grpcPagerService.createParams(state)),
    concatMap(async (params) => {
      await this._router.navigate([], {
        queryParams: params,
        queryParamsHandling: 'merge',
        relativeTo: this._activatedRoute,
      });

      return params;
    }),
    map((params) => this._grpcPagerService.createHttpParams(params)),
    switchMap((httpParams) => this.listSessions$(httpParams))
  );

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _grpcSessionsService: GrpcSessionsService,
    private _grpcPagerService: GrpcPagerService
  ) {}

  /**
   * Cancel a session
   *
   * @param sessionId
   */
  public cancelSession(sessionId: string): void {
    this._grpcSessionsService
      .cancel$(sessionId)
      .pipe(first())
      .subscribe({
        next: () => this.refreshSessions$(),
      });
  }

  /**
   * Refresh sessions using new state
   *
   * @param state
   *
   * @returns void
   */
  public refreshSessions$(state?: ClrDatagridStateInterface): void {
    if (state) {
      this._state = state;
    }
    this.trigger$.next(this._state);
  }

  /**
   * Get query params from route
   *
   * @param param
   *
   * @returns Observable<string>
   */
  public queryParam$(param: string): Observable<number> {
    return this._activatedRoute.queryParamMap.pipe(
      map((params) => params.get(param)),
      map((value) => Number(value)),
      distinctUntilChanged()
    );
  }

  /**
   * List sessions
   *
   * @returns Observable<ListSessionsResponse>
   */
  private listSessions$(params: HttpParams): Observable<ListSessionsResponse> {
    console.log('SessionsListComponent.listSessions$');
    return this._grpcSessionsService.list$(params).pipe(
      tap((sessions) => {
        this.loadingSessions$.next(false);
        this.totalSessions$.next(sessions.totalCount ?? 0);
      })
    );
  }
}
