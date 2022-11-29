import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HistoryService } from '../../../core/services/history.service';

@Component({
  selector: 'app-pages-navigation-history',
  templateUrl: './navigation-history.component.html',
  styleUrls: ['./navigation-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationHistoryComponent {
  constructor(
    private _historyService: HistoryService,
    private _router: Router
  ) {}

  public get history$(): Observable<
    {
      title: string;
      url: string;
      queryParams: Params;
    }[]
  > {
    return this._historyService.history$;
  }

  public navigate(url: string): void {
    this._router.navigateByUrl(url);
  }
}
