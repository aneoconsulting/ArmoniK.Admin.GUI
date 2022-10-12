import { Component } from '@angular/core';
import { HistoryService } from '../../../core/services/history.service';

@Component({
  selector: 'app-pages-navigation-history',
  templateUrl: './navigation-history.component.html',
  styleUrls: ['./navigation-history.component.scss'],
})
export class NavigationHistoryComponent {
  constructor(private historyService: HistoryService) {}

  public get history() {
    return this.historyService.history;
  }
}
