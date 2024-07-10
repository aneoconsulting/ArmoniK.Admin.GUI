import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { Timestamp } from '@ngx-grpc/well-known-types';
import { TimeKeys } from '@app/types/data';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';

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
  ]
})
export class TimeLineComponent {
  dates: {[key: TimeKeys]: Date | undefined} = {};
  private _keys: TimeKeys[];
  prettyKeys: string[];

  @Input({ required: true }) set keys(entries: TimeKeys[]) {
    this._keys = entries;
    console.log(entries);
    this.prettyKeys = entries.map(key => this.prettyKey(key));
  }

  @Input({ required: true }) set timestamps(entries: {[key: TimeKeys]: Timestamp}) {
    this.keys.forEach(key => {
      this.dates[key] = entries[key]?.toDate();
    });
  }

  get keys(): TimeKeys[] {
    return this._keys;
  }

  prettyKey(key: TimeKeys) {
    return `${key[0].toLocaleUpperCase()}${key.slice(1, -2)}`;
  }
}