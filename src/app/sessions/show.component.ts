import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subject, map, switchMap } from 'rxjs';
import { SessionShowComponent, ShowActionButton } from '@app/types/components/show';
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
export class ShowComponent implements SessionShowComponent, OnInit, AfterViewInit {
  sharableURL = '';
  data: SessionRaw | null = null;
  refresh: Subject<void> = new Subject<void>();
  id: string;

  actionData: { sessionId: string; partitionId: string; resultsQueryParams: { [key: string]: string; }; taskStatus: TaskStatus; };
  actionButtons: ShowActionButton[];

  _iconsService = inject(IconsService);
  _shareURLService = inject(ShareUrlService);
  _sessionsStatusesService = inject(SessionsStatusesService);
  _notificationService = inject(NotificationService);
  _grpcService = inject(SessionsGrpcService);
  _route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.sharableURL = this._shareURLService.generateSharableURL(null, null);
  }

  ngAfterViewInit(): void {
    this.refresh.pipe(
      switchMap(() => {
        return this._grpcService.get$(this.id);
      }),
      map((data) => {
        return data.session ?? null;
      })
    ).subscribe((data) => this.data = data);

    this._route.params.pipe(
      map(params => params['id']),
    ).subscribe(id => {
      this.id = id;
      this.refresh.next();
    });
  }

  get statuses() {
    return this._sessionsStatusesService.statuses;
  }

  getPageIcon(page: Page) {
    return this._iconsService.getPageIcon(page);
  }

  getIcon(name: string): string {
    return this._iconsService.getIcon(name);
  }

  cancelSessions(): void {
    if(!this.data?.sessionId) {
      return;
    }

    this._grpcService.cancel$(this.data.sessionId).subscribe({
      complete: () => {
        this._notificationService.success('Session canceled');
        this.refresh.next();
      },
      error: (error) => {
        console.error(error);
        this._notificationService.error('Unable to cancel session');
      },
    });
  }

  onRefresh(): void {
    this.refresh.next();
  }
}
