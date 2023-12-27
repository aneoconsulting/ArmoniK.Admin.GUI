import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription, map, switchMap } from 'rxjs';
import { AppShowComponent } from '@app/types/components';
import { Page } from '@app/types/pages';
import { ShowPageComponent } from '@components/show-page.component';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { SessionsFiltersService } from './services/sessions-filters.service';
import { SessionsGrpcService } from './services/sessions-grpc.service';
import { SessionsIndexService } from './services/sessions-index.service';
import { SessionsStatusesService } from './services/sessions-statuses.service';
import { SessionRaw } from './types';

@Component({
  selector: 'app-sessions-show',
  template: `
<app-show-page [id]="data?.sessionId ?? null" [data]="data" [sharableURL]="sharableURL" [statuses]="statuses" [type]="'sessions'" (cancel)="cancelSessions()">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getPageIcon('sessions')"></mat-icon>
  <span i18n="Page title"> Session </span>
</app-show-page>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [
    UtilsService,
    ShareUrlService,
    QueryParamsService,
    SessionsGrpcService,
    SessionsStatusesService,
    SessionsIndexService,
    SessionsFiltersService,
    TableService,
    TableURLService,
    TableStorageService,
    NotificationService,
    MatSnackBar
  ],
  imports: [
    ShowPageComponent,
    MatIconModule,
  ]
})
export class ShowComponent implements AppShowComponent<SessionRaw>, OnInit, AfterViewInit {
  sharableURL = '';
  data: SessionRaw | null = null;
  subscription: Subscription;
  refresh: Subject<void> = new Subject<void>();

  #iconsService = inject(IconsService);
  #shareURLService = inject(ShareUrlService);
  #sessionsStatusesService = inject(SessionsStatusesService);
  #notificationService = inject(NotificationService);

  constructor(
    private _route: ActivatedRoute,
    private _sessionsGrpcService: SessionsGrpcService,
  ) {}

  ngOnInit(): void {
    this.sharableURL = this.#shareURLService.generateSharableURL(null, null);
  }

  ngAfterViewInit(): void {
    this.subscription = this._route.params.pipe(
      map(params => params['id']),
      switchMap((id) => {
        return this._sessionsGrpcService.get$(id);
      }),
      map((data) => {
        return data.session ?? null;
      })
    ).subscribe((data) => this.data = data);
    this.subscription.add(this.refresh);
  }

  get statuses() {
    return this.#sessionsStatusesService.statuses;
  }

  getPageIcon(page: Page) {
    return this.#iconsService.getPageIcon(page);
  }

  cancelSessions(): void {
    if(!this.data?.sessionId) {
      return;
    }

    this._sessionsGrpcService.cancel$(this.data.sessionId).subscribe({
      complete: () => {
        this.#notificationService.success('Session canceled');
        this.refresh.next();
      },
      error: (error) => {
        console.error(error);
        this.#notificationService.error('Unable to cancel session');
      },
    });
  }
}
