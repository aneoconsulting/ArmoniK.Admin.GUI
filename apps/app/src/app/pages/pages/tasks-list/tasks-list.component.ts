import { Component } from '@angular/core';
import { ClrDatagridModule } from '@clr/angular';

@Component({
  standalone: true,
  selector: 'app-pages-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
  imports: [ClrDatagridModule],
})
export class TasksListComponent {}
