import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { DataRaw } from '@app/types/data';
import { ShowCardContentComponent } from './show-card-content.component';

@Component({
  selector: 'app-show-card',
  templateUrl: 'show-card.component.html',
  styles: [`
pre {
  margin-top: 0;
}
  `],
  standalone: true,
  imports: [
    ShowCardContentComponent,
    MatCardModule,
    MatProgressSpinnerModule
  ]
})
export class ShowCardComponent<T extends DataRaw> implements OnInit {
  @Input({ required: true }) data$: Subject<T>;
  @Input() statuses: Record<number, string> = [];

  data: T | null = null;

  ngOnInit(): void {
    this.data$.subscribe(data => this.data = data);
  }
}
