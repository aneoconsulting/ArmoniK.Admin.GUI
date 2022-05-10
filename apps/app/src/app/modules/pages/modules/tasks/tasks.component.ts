import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TitleService } from '../../../core/services';

@Component({
  selector: 'app-pages-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent {
  constructor(
    private titleService: TitleService,
    private translateService: TranslateService
  ) {
    this.titleService.setTitle(this.translateService.instant('tasks.title'));
  }
}
