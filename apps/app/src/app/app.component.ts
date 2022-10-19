import { Component, OnDestroy, OnInit } from '@angular/core';
import { first, merge, Subscription } from 'rxjs';
import { GrafanaService, SeqService, SettingsService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private _seqService: SeqService,
    private _grafanaService: GrafanaService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    merge(this._grafanaService.healthCheck$(), this._seqService.healthCheck$())
      .pipe(first())
      .subscribe(({ ok, service }) => {
        if (ok && service === 'seq') {
          this.settingsService.seqEnabled = true;
        }
        if (ok && service === 'grafana') {
          this.settingsService.grafanaEnabled = true;
        }
      });
  }
}
