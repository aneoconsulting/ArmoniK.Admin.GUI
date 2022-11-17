import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClrVerticalNavModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { HistoryService } from '../../../core/services/history.service';

@Component({
  standalone: true,
  selector: 'app-pages-navigation-history',
  templateUrl: './navigation-history.component.html',
  styleUrls: ['./navigation-history.component.scss'],
  imports: [CommonModule, RouterModule, ClrVerticalNavModule, TranslateModule],
})
export class NavigationHistoryComponent {
  constructor(private _historyService: HistoryService) {}

  public get history$(): Observable<string[]> {
    return this._historyService.history$;
  }
}
