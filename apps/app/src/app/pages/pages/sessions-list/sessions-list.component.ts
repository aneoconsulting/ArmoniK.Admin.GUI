import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import {
  BehaviorSubject,
  distinctUntilChanged,
  map,
  Observable,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { GrpcSessionsService } from '../../../core';
import { ListSessionsResponse } from '../../../core/types/proto/sessions-common.pb';

@Component({
  selector: 'app-pages-sessions-list',
  templateUrl: './sessions-list.component.html',
  styleUrls: ['./sessions-list.component.scss'],
})
export class SessionsListComponent {
  trigger$ = new Subject<ClrDatagridStateInterface>();

  loadingSessions$ = new BehaviorSubject<boolean>(true);
  totalSessions$ = new BehaviorSubject<number>(0);

  loadSessions$ = this.trigger$.pipe(
    tap(() => this.loadingSessions$.next(true)),
    tap((state) => {
      // update url
      this._router.navigate([], {
        queryParams: {
          page: state?.page?.current ?? 1,
          pageSize: state?.page?.size ?? 10,
        },
        queryParamsHandling: 'merge',
        relativeTo: this._activatedRoute,
      });
    }),
    map((state) => {
      console.log('Transform state', state);
      return state;
    }),
    switchMap(() => this.listSessions$() /* Give params */)
  );

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _grpcSessionsService: GrpcSessionsService
  ) {
    console.log('SessionsListComponent');
  }

  public queryParam$(param: string): Observable<number> {
    return this._activatedRoute.queryParamMap.pipe(
      map((params) => params.get(param)),
      map((value) => Number(value)),
      distinctUntilChanged()
    );
  }

  /**
   * Refresh sessions using new state
   *
   * @param state
   *
   * @returns void
   */
  public refreshSessions$(state: ClrDatagridStateInterface): void {
    this.trigger$.next(state);
  }

  /**
   * List sessions
   *
   * @returns Observable<ListSessionsResponse>
   */
  private listSessions$(): Observable<ListSessionsResponse> {
    return this._grpcSessionsService.list$().pipe(
      tap((sessions) => {
        this.loadingSessions$.next(false);
        this.totalSessions$.next(sessions.totalCount ?? 0);
      }),
      tap((sessions) => console.log('Sessions', sessions))
    );
  }
}
