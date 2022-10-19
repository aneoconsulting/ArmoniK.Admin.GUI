import { Component } from '@angular/core';
import { map, timer } from 'rxjs';

@Component({
  selector: 'app-pages-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
})
export class TimeComponent {
  time$ = timer(0, 1000).pipe(map(() => new Date()));
}
