import { Component } from '@angular/core';
import { ClrDatagridModule } from '@clr/angular';

@Component({
  standalone: true,
  selector: 'app-pages-tasks-errors-list',
  templateUrl: './tasks-errors-list.component.html',
  styleUrls: ['./tasks-errors-list.component.scss'],
  imports: [ClrDatagridModule],
})
export class TasksErrorsListComponent {}
