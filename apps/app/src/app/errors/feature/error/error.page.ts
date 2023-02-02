import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pages-error',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss'],
})
export class ErrorComponent {
  constructor(private _route: ActivatedRoute) {}

  get statusCode$(): Observable<string> {
    return this._route.paramMap.pipe(
      map((params) => params.get('statusCode') || '404')
    );
  }

  get message$(): Observable<string> {
    return this._route.queryParamMap.pipe(
      map((params) => params.get('message') || $localize`Page not found.`)
    );
  }
}
