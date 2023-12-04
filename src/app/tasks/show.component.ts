import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { AppShowComponent } from '@app/types/components';
import { ShowPageComponent } from '@components/show-page.component';
import { IconsService } from '@services/icons.service';
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
<app-show-page [id]="data?.id ?? null" [data]="data" [sharableURL]="sharableURL" [statuses]="statuses">
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
    TasksFiltersService
  ],
  imports: [
    ShowPageComponent,
    MatIconModule,
  ]
})
export class ShowComponent implements AppShowComponent<TaskRaw>, OnInit, AfterViewInit {
  sharableURL = '';
  data: TaskRaw | null = null;

  #shareURLService = inject(ShareUrlService);
  #route = inject(ActivatedRoute);
  #tasksGrpcService = inject(TasksGrpcService);
  #tasksStatusesService = inject(TasksStatusesService);
  #iconsService = inject(IconsService);


  ngOnInit(): void {
    this.sharableURL = this.#shareURLService.generateSharableURL(null, null);
  }

  ngAfterViewInit(): void {
    this.#route.params.pipe(
      map(params => params['id']),
      switchMap((id) => {
        return this.#tasksGrpcService.get$(id);
      }),
      map((data) => {
        return data.task ?? null;
      })
    )
      .subscribe((data) => this.data = data);
  }

  get statuses() {
    return this.#tasksStatusesService.statuses;
  }

  get taskIcon() {
    return this.#iconsService.getPageIcon('tasks');
  }
}
