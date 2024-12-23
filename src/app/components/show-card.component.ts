import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
export class ShowCardComponent<T extends DataRaw> {
  @Input({ required: true }) data: T | null;
}
