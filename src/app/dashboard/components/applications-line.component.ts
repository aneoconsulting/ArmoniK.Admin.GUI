import { NgForOf, NgIf } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable, Subject, Subscription, catchError, merge, of, startWith, switchMap, tap } from 'rxjs';
import { ApplicationsFiltersService } from '@app/applications/services/applications-filters.service';
import { ApplicationsGrpcService } from '@app/applications/services/applications-grpc.service';
import { ApplicationRaw, ApplicationRawFieldKey, ApplicationRawFilter, ApplicationRawListOptions } from '@app/applications/types';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { TasksIndexService } from '@app/tasks/services/tasks-index.service';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { EditNameLineData, EditNameLineResult } from '@app/types/dialog';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';
import { UtilsService } from '@services/utils.service';
import { ApplicationStatusGroupCardComponent } from './applications-status-group-card.component';
import { EditNameLineDialogComponent } from './edit-name-line-dialog.component';
import { StatusesGroupCardComponent } from './statuses-group-card.component';
import { ActionsToolbarGroupComponent } from '../../components/actions-toolbar-group.component';
import { ActionsToolbarComponent } from '../../components/actions-toolbar.component';
import { AutoRefreshButtonComponent } from '../../components/auto-refresh-button.component';
import { PageSectionHeaderComponent } from '../../components/page-section-header.component';
import { PageSectionComponent } from '../../components/page-section.component';
import { RefreshButtonComponent } from '../../components/refresh-button.component';
import { SpinnerComponent } from '../../components/spinner.component';
import { Line } from '../types';

@Component({
  selector: 'app-dashboard-applications-line',
  template: `
<mat-toolbar>
  <mat-toolbar-row>
    <app-actions-toolbar>
      <app-actions-toolbar-group>
        <app-refresh-button [tooltip]="autoRefreshTooltip()" (refreshChange)="onRefresh()"></app-refresh-button>
        <app-spinner *ngIf="loadApplicationData"></app-spinner>
      </app-actions-toolbar-group>

      <app-actions-toolbar-group>
        <app-auto-refresh-button [intervalValue]="line.interval" (intervalValueChange)="onIntervalValueChange($event)"></app-auto-refresh-button>

        <button  mat-icon-button [matMenuTriggerFor]="menu" aria-label="Show more options" i18n-aria-label matTooltip="More Options" i18n-matTooltip>
          <mat-icon class="add-button" aria-hidden="true" [fontIcon]="getIcon('more')"></mat-icon>
        </button>

        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="onEditNameLine(line.name)">
            <mat-icon aria-hidden="true"  [fontIcon]="getIcon('edit')"></mat-icon>
              <span i18n>
                Edit name line
              </span>
          </button>
          <button mat-menu-item (click)="onDeleteLine(line)">
              <mat-icon aria-hidden="true" [fontIcon]="getIcon('delete')"></mat-icon>
              <span i18n>
                Delete line
              </span>
          </button>
        </mat-menu>
        </app-actions-toolbar-group>
    </app-actions-toolbar>
  </mat-toolbar-row>

  <mat-toolbar-row class="filters">
    <app-filters-toolbar [filters]="filters" (filtersChange)="onFiltersChange($event)"></app-filters-toolbar>
  </mat-toolbar-row>
</mat-toolbar>

<app-application-status-group-card [data]="data" [filters]="filters"></app-application-status-group-card>
  `,
  styles: [`
app-actions-toolbar {
  flex-grow: 1;
}


.filters {
  height: auto;
  min-height: 64px;

  padding: 1rem;
}
    `],
  standalone: true,
  providers: [
    ShareUrlService,
    QueryParamsService,
    StorageService,
    AutoRefreshService,
    UtilsService,
    TasksIndexService,
    TasksGrpcService,
    ApplicationsFiltersService,
    ApplicationsGrpcService,
    NotificationService,
    MatSnackBar,
    {
      provide: DATA_FILTERS_SERVICE,
      useClass: ApplicationsFiltersService
    },
  ],
  imports: [
    PageSectionComponent,
    PageSectionHeaderComponent,
    ActionsToolbarComponent,
    RefreshButtonComponent,
    SpinnerComponent,
    ActionsToolbarGroupComponent,
    AutoRefreshButtonComponent,
    FiltersToolbarComponent,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    StatusesGroupCardComponent,
    NgIf,
    NgForOf,
    ApplicationStatusGroupCardComponent
  ]
})
export class ApplicationsLineComponent implements OnInit, AfterViewInit,OnDestroy {
  readonly #dialog = inject(MatDialog);
  readonly #autoRefreshService = inject(AutoRefreshService);
  readonly #iconsService = inject(IconsService);
  readonly #applicationGrpcService = inject(ApplicationsGrpcService);
  readonly #notificationService = inject(NotificationService);

  @Input({ required: true }) line: Line;
  @Output() lineChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() lineDelete: EventEmitter<Line> = new EventEmitter<Line>();

  total: number;
  loadApplicationData = false;
  data: ApplicationRaw[] = [];
  filters: ApplicationRawFilter;

  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  subscriptions: Subscription = new Subscription();
  interval$: Observable<number> = this.#autoRefreshService.createInterval(this.interval, this.stopInterval);
  
  ngOnInit(): void {
    this.loadApplicationData = true;
    this.filters = this.line.filters as ApplicationRawFilter;
    this.interval.next(this.line.interval);
  }

  ngAfterViewInit() {
    const mergeSubscription = merge(this.refresh, this.interval$).pipe(
      startWith(0),
      tap(() => (this.loadApplicationData = true)),
      switchMap(() => {
        const options: ApplicationRawListOptions = {
          pageIndex: 0,
          pageSize: 5,
          sort: {
            active: 'name' as ApplicationRawFieldKey,
            direction: 'desc',
          },
        };

        return this.#applicationGrpcService.list$(options, this.filters).pipe(catchError((error) => {
          console.error(error);
          this.#notificationService.error('Unable to fetch applications');
          return of(null);
        }));
      })
    ).subscribe(data => {
      this.data = data?.applications ?? [];
      this.loadApplicationData = false;
    });

    this.subscriptions.add(mergeSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

  autoRefreshTooltip(): string {
    return this.#autoRefreshService.autoRefreshTooltip(this.line.interval);
  }

  onRefresh() {
    this.refresh.next();
  }

  onIntervalValueChange(value: number) {
    this.line.interval = value;

    if(value === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(value);
      this.refresh.next();
    }

    this.lineChange.emit();

  }

  onEditNameLine(value: string) {
    const dialogRef: MatDialogRef<EditNameLineDialogComponent, EditNameLineResult> = this.#dialog.open<EditNameLineDialogComponent, EditNameLineData, EditNameLineResult>(EditNameLineDialogComponent, {
      data: {
        name: value
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.line.name = result.name;
        this.lineChange.emit();
      }
    });
  }

  onDeleteLine(value: Line): void {
    this.lineDelete.emit(value);
  }

  onFiltersChange(value: unknown[]) {
    this.filters = value as [];
    this.line.filters = value as [];
    this.lineChange.emit();
    this.refresh.next();
  }
}
