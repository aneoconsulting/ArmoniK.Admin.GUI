import { ApplicationRawEnumField, FilterStringOperator, SessionTaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GrpcAction } from '@app/types/actions.type';
import { AbstractTaskByStatusTableComponent } from '@app/types/components/table';
import { ArmonikData } from '@app/types/data';
import { TableComponent } from '@components/table/table.component';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { TableTasksByStatus, TasksByStatusService } from '@services/tasks-by-status.service';
import { Subject } from 'rxjs';
import ApplicationsDataService from '../services/applications-data.service';
import { ApplicationRaw } from '../types';

@Component({
  selector: 'app-application-table',
  templateUrl: './table.component.html',
  providers: [
    TasksByStatusService,
    MatDialog,
    FiltersService,
  ],
  imports: [
    TableComponent,
  ]
})
export class ApplicationsTableComponent extends AbstractTaskByStatusTableComponent<ApplicationRaw, ApplicationRawEnumField>
  implements OnInit {
  table: TableTasksByStatus = 'applications';
  
  readonly tableDataService = inject(ApplicationsDataService);
  readonly iconsService = inject(IconsService);
  readonly router = inject(Router);

  seeSessions$ = new Subject<ApplicationRaw>();
  seeSessionsSubscription = this.seeSessions$.subscribe(application => this.router.navigate(['/sessions'], { queryParams: this.createViewSessionsQueryParams(application.name, application.version) }));

  actions: GrpcAction<ApplicationRaw>[] = [
    {
      label: $localize`See session`,
      icon: this.getIcon('sessions'),
      click: (application: ApplicationRaw[]) => this.seeSessions$.next(application[0]),
    },
  ];

  ngOnInit(): void {
    this.initTableDataService();
    this.initStatuses();
  }
  
  isDataRawEqual(value: ApplicationRaw, entry: ApplicationRaw): boolean {
    return value.name === entry.name && value.version === entry.version;
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  createViewSessionsQueryParams(name: string, version: string) {
    return {
      [`0-options-${SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`]: name,
      [`0-options-${SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`]: version,
    };
  }

  trackBy(index: number, item: ArmonikData<ApplicationRaw>) {
    return `${item.raw.name}-${item.raw.version}`;
  }
}