import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@armonik.admin.gui/api-interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  hello$ = this.http.get<Message>('/api/hello');

  links = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/sessions', label: 'Sessions' },
  ];
  constructor(private http: HttpClient) {}
}
