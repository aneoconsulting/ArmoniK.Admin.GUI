import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable, timer } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-pages-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class TimeComponent implements OnInit {
  time$: Observable<Date>;

  ngOnInit() {
    this.time$ = timer(0, 1000).pipe(map(() => new Date()));
  }
}
