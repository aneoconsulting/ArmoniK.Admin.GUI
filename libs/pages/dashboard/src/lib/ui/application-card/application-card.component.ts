import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { GrpcApplicationsService } from '@armonik.admin.gui/applications/data-access';
import { Observable, map, switchMap, timer } from 'rxjs';
import { ShowTasksByStatusComponent } from '../show-tasks-by-status/show-tasks-by-status.component';
import { DashboardDefaultGroupService } from '../../data-access/dashboard-default-group.service';
import { Group } from '../../types/group.type';
import { ApplicationRaw, CountTasksByStatusApplicationResponse } from '@aneoconsultingfr/armonik.api.angular';

@Component({
  standalone: true,
  selector: 'armonik-admin-gui-dashboard-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShowTasksByStatusComponent, AsyncPipe, NgIf],
  providers: [GrpcApplicationsService, DashboardDefaultGroupService],
})
export class ApplicationCardComponent implements OnInit {
  @Input() application: ApplicationRaw;

  public loadCountTasksByStatus$ = timer(0, 2000).pipe(
    switchMap(() => this._countTasksByStatus$()),
    map((data) => {
      return data.status ?? [];
    })
  );

  public groups: Group[] = []

  constructor(private _grpcApplicationsService: GrpcApplicationsService, private _dashboardDefaultGroupService: DashboardDefaultGroupService) { }

  ngOnInit(): void {
    this.groups = this._dashboardDefaultGroupService.defaultGroups;
  }

  private _countTasksByStatus$(): Observable<CountTasksByStatusApplicationResponse> {
    const params = {
      name: this.application.name,
      version: this.application.version,
    };

    return this._grpcApplicationsService.countTasksByStatus$(params);
  }
}
