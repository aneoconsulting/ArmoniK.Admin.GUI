import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { HistoryService } from '../../../core/services/history.service';

@Component({
  selector: 'app-pages-navigation-history',
  templateUrl: './navigation-history.component.html',
  styleUrls: ['./navigation-history.component.scss'],
})
export class NavigationHistoryComponent {
  constructor(private _historyService: HistoryService) {}

  public get history$(): Observable<string[]> {
    return this._historyService.history$;
  }
}
