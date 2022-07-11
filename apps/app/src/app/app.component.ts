import { Component, OnInit } from '@angular/core';
import { SeqService, SettingsService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private seqService: SeqService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    // Ping Seq to check if it is up and running
    this.seqService.ping().subscribe({
      next: () => {
        // Enable Seq in settings
        this.settingsService.isSeqUp = true;
      },
    });
  }
}
