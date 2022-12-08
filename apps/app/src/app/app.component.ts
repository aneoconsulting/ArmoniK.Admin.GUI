import { Component, OnInit } from '@angular/core';
import { first, merge } from 'rxjs';
import {
  ExternalServicesEnum,
  GrafanaService,
  SeqService,
  SettingsService,
} from './pages';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private _seqService: SeqService,
    private _grafanaService: GrafanaService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    merge(this._seqService.healthCheck$(), this._grafanaService.healthCheck$())
      .pipe(first())
      .subscribe(({ isResponseOk, service }) => {
        if (isResponseOk && service === ExternalServicesEnum.SEQ) {
          this.settingsService.seqSubject$.next(true);
        }
        if (isResponseOk && service === ExternalServicesEnum.GRAFANA) {
          this.settingsService.grafanaSubject$.next(true);
        }
      });
  }
}
