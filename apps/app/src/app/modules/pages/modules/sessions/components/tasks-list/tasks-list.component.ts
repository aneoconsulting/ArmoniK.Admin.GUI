import { Component } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { TranslationService } from '../../../../../core/';
import { Task } from '../../../../../core/';

@Component({
  selector: 'app-pages-sessions-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
})
export class TasksListComponent {
  total = 0;
  loading = true;

  tasks: Task[] = [
    {
      _id: 'e297367f-cd8f-44bb-8cb0-497c5fbe5ba5',
      Status: 'Running',
    },
    {
      _id: 'daeb8483-a0a0-4f07-ac08-115f49fac660',
      Status: 'Running',
    },
    {
      _id: 'dbf6a5d0-ebd0-42b7-be4f-936bcf30b3ec',
      Status: 'Running',
    },
    {
      _id: '45469ed3-1891-4366-b598-cbdc45c3056d',
      Status: 'Processing',
    },
    {
      _id: 'bf225c79-ae07-4e87-8fb4-33a0798950a5',
      Status: 'Running',
    },
  ];

  constructor(private translationService: TranslationService) {
    this.total = this.tasks.length;
    this.loading = false;
  }

  trackByTask(_: number, task: Task) {
    return task._id;
  }

  // refresh(state: ClrDatagridStateInterface) {
  //   // TODO: refresh using state (gui-tasks)
  // }
}
