import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  ClarityModule,
  ClrDatagridModule,
  ClrDatagridStateInterface,
} from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import {
  merge,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import {
  AutoRefreshDropdownComponent,
  DisabledIntervalValue,
} from '../auto-refresh-dropdown/auto-refresh-dropdown.component';

@Component({
  standalone: true,
  selector: 'armonik-admin-gui-datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.scss'],
  imports: [AutoRefreshDropdownComponent, ClrDatagridModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridComponent implements OnInit, OnDestroy {
  @Input() intervalStop = new Subject<void>();
  @Output() refreshChange = new EventEmitter<ClrDatagridStateInterface>();

  private _state: ClrDatagridStateInterface = {};

  /** Used for the manual refresh */
  private _manualRefresh = new Subject<void>();
  private _manualTrigger$ = this._manualRefresh.asObservable();

  /** Used for the datagrid refresh */
  private _datagridSubject = new Subject<void>();
  private _datagridTrigger$ = this._datagridSubject.asObservable();

  /** Used for the auto-refresh */
  public intervalStop$ = this.intervalStop.asObservable();
  private _intervalRefresh = new Subject<number>();
  private _intervalTrigger$ = this._intervalRefresh.pipe(
    switchMap((time) => {
      return timer(0, time).pipe(takeUntil(this.intervalStop$));
    })
  );

  private _refreshSubscription: Subscription | undefined;
  private _refresh$ = merge(
    this._manualTrigger$,
    this._datagridTrigger$,
    this._intervalTrigger$
  ).pipe(tap(() => this.refreshChange.emit(this._state)));

  ngOnInit(): void {
    this._refreshSubscription = this._refresh$.subscribe();
  }

  ngOnDestroy(): void {
    this._refreshSubscription?.unsubscribe();
  }

  /**
   * Handle the manual refresh button click.
   */
  public onManualRefresh() {
    this._manualRefresh.next();
  }

  /**
   * Handle the datagrid refresh.
   *
   * @param state The datagrid state.
   */
  public onDatagridRefresh(state: ClrDatagridStateInterface) {
    this._state = state;
    this._datagridSubject.next();
  }

  /**
   * Handle the interval value change.
   *
   * @param value The new interval value.
   */
  public onIntervalRefresh(value: number) {
    // Stop interval
    if (value === DisabledIntervalValue) {
      this.intervalStop.next();
      return;
    }

    this._intervalRefresh.next(value);
  }
}
