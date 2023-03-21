import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ApplicationsListComponent } from '../applications-list/applications-list.component';
import { TasksGroupedByStatusComponent } from '../tasks-grouped-by-status/tasks-grouped-by-status.component';

@Component({
  standalone: true,
  selector: 'armonik-admin-gui-dashboard',
  templateUrl: './page-dashboard-feature.component.html',
  styleUrls: ['./page-dashboard-feature.component.scss'],
  imports: [ApplicationsListComponent, TasksGroupedByStatusComponent],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}
