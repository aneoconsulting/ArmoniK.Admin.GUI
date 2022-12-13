import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable, timer } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-pages-the-header-time',
  templateUrl: './the-header-time.component.html',
  styleUrls: ['./the-header-time.component.scss'],
  imports: [NgIf, AsyncPipe, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheHeaderTimeComponent implements OnInit {
  time$: Observable<Date>;

  ngOnInit() {
    this.time$ = timer(0, 1000).pipe(map(() => new Date()));
  }
}
