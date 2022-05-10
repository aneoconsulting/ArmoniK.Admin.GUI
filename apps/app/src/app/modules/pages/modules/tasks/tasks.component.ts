import { Component } from '@angular/core';
import { TitleService } from '../../../core/services';

@Component({
  selector: 'app-pages-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent {
  constructor(private titleService: TitleService) {
    this.titleService.setTitle('Tasks');
  }
}
