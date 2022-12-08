import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClrVerticalNavModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { HistoryService } from '../../../core/services/history.service';

@Component({
  standalone: true,
  selector: 'app-layouts-the-history-navigation',
  templateUrl: './the-history-navigation.component.html',
  styleUrls: ['./the-history-navigation.component.scss'],
  imports: [
    RouterModule,
    ClrVerticalNavModule,
    TranslateModule,
    NgFor,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheHistoryNavigationComponent {
  constructor(private _historyService: HistoryService) {}

  public get history$(): Observable<string[]> {
    return this._historyService.history$;
  }
}
