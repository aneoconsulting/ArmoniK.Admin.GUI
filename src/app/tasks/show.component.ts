import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subject, map, switchMap } from 'rxjs';
import { AppShowComponent } from '@app/types/components';
import { ShowPageComponent } from '@components/show-page.component';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { TasksFiltersService } from './services/tasks-filters.service';
import { TasksGrpcService } from './services/tasks-grpc.service';
import { TasksIndexService } from './services/tasks-index.service';
import { TasksStatusesService } from './services/tasks-statuses.service';
import { TaskRaw } from './types';

@Component({
  selector: 'app-tasks-show',
  template: `
<app-show-page [id]="data?.id ?? null" [data]="data" [sharableURL]="sharableURL" [statuses]="statuses" type="tasks" (cancel)="cancelTasks()" (refresh)="onRefresh()">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="taskIcon"></mat-icon>
  <span i18n="Page title"> Task </span>
</app-show-page>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [
    IconsService,
    UtilsService,
    ShareUrlService,
    QueryParamsService,
    TasksGrpcService,
    TasksStatusesService,
    TasksIndexService,
    TableService,
    TableStorageService,
    TableURLService,
    TasksFiltersService,
    NotificationService,
    MatSnackBar
  ],
  imports: [
    ShowPageComponent,
    MatIconModule,
  ]
})
export class ShowComponent implements AppShowComponent<TaskRaw>, OnInit, AfterViewInit {
  sharableURL = '';
  data: TaskRaw | null = null;
  refresh: Subject<void> = new Subject<void>();
  id: string;

  #shareURLService = inject(ShareUrlService);
  #route = inject(ActivatedRoute);
  #tasksGrpcService = inject(TasksGrpcService);
  #tasksStatusesService = inject(TasksStatusesService);
  #iconsService = inject(IconsService);
  #notificationService = inject(NotificationService);


  ngOnInit(): void {
    this.sharableURL = this.#shareURLService.generateSharableURL(null, null);
  }

  ngAfterViewInit(): void {

    this.refresh.pipe(
      switchMap(() => {
        return this.#tasksGrpcService.get$(this.id);
      }),
      map((data) => {
        return data.task ?? null;
      })
    ).subscribe((data) => this.data = data);

    this.#route.params.pipe(
      map(params => params['id']),
    ).subscribe(id => {
      this.id = id;
      this.refresh.next();
    });
  }

  get statuses() {
    return this.#tasksStatusesService.statuses;
  }

  get taskIcon() {
    return this.#iconsService.getPageIcon('tasks');
  }

  cancelTasks(): void {
    if(!this.data?.id) {
      return;
    }

    this.#tasksGrpcService.cancel$([this.data.id]).subscribe({
      complete: () => {
        this.#notificationService.success('Task canceled');
        this.refresh.next();
      },
      error: (error) => {
        console.error(error);
        this.#notificationService.error('Unable to cancel task');
      },
    });
  }

  onRefresh() {
    this.refresh.next();
  }
}
