import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SeqService, SettingsService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  // Unsubscribe from ping
  private pingSubscription: Subscription | null = null;

  constructor(
    private seqService: SeqService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    // Ping Seq to check if it is up and running
    this.pingSubscription = this.seqService.ping().subscribe({
      next: (data) => {
        // Enable Seq in settings
        this.settingsService.seqEndpoint = data.seqEndpoint;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.pingSubscription) {
      this.pingSubscription.unsubscribe();
    }
  }
}
