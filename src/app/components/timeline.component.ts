import { DatePipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { Timestamp } from '@ngx-grpc/well-known-types';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-timeline',
  templateUrl: 'timeline.component.html',
  styles: [`
  article {
    display: flex;
    flex-direction: column;
  }

  p {
    margin: 0;
  }
  `],
  standalone: true,
  imports: [
    MatStepperModule,
    MatIconModule,
    EmptyCellPipe,
    DatePipe
  ],
  providers: [
    IconsService
  ]
})
export class TimeLineComponent {
  readonly iconsService = inject(IconsService);

  dates: {[key: string]: Date | undefined} = {};

  @Input({ required: true }) timeKeys: string[];
  @Input({ required: false }) set data(entries: {[key: string]: Timestamp}) {
    this.timeKeys.forEach(key => {
      this.dates[key] = entries[key]?.toDate();
    });
  }

  prettyKey(key: string) {
    return `${key[0].toLocaleUpperCase()}${key.slice(1, -2)}`;
  }

  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }
}