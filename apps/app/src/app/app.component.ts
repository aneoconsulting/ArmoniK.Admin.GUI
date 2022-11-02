import { Component, OnInit } from '@angular/core';
import { first, merge } from 'rxjs';
import {
  ExternalServices,
  GrafanaService,
  SeqService,
  SettingsService,
} from './core';

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
      .subscribe(({ ok, service }) => {
        if (ok && service === ExternalServices.SEQ) {
          this.settingsService.seqEnabled = true;
        }
        if (ok && service === ExternalServices.GRAFANA) {
          this.settingsService.grafanaEnabled = true;
        }
      });
  }
}
