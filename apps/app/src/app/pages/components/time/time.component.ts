import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable, timer } from 'rxjs';

@Component({
  selector: 'app-pages-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeComponent implements OnInit {
  time$: Observable<Date>;

  ngOnInit() {
    this.time$ = timer(0, 1000).pipe(map(() => new Date()));
  }
}
