import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClrVerticalNavModule } from '@clr/angular';

import { Observable } from 'rxjs';
import { HistoryItem, HistoryService } from '../../util';

@Component({
  standalone: true,
  selector: 'app-pages-the-history-navigation',
  templateUrl: './the-history-navigation.component.html',
  styleUrls: ['./the-history-navigation.component.scss'],
  imports: [RouterModule, ClrVerticalNavModule, NgFor, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheHistoryNavigationComponent {
  constructor(private _historyService: HistoryService) {}

  public get history$(): Observable<HistoryItem[]> {
    return this._historyService.history$;
  }

  public generateRouterLink(url: string[]): string[] {
    return ['/', ...url];
  }
}
