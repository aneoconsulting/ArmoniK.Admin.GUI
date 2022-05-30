import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleService } from '../../../../../../../core';

@Component({
  selector: 'app-pages-sessions-tasks-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
})
export class TaskDetailComponent {
  constructor(
    private route: ActivatedRoute,
    private titleService: TitleService
  ) {
    this.titleService.setTitle('tasks.task-detail.title');
  }

  getTaskId() {
    return this.route.snapshot.paramMap.get('id');
  }
}
