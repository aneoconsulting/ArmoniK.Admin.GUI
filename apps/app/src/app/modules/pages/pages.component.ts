import { Component } from '@angular/core';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent {
  links = [
    { path: 'dashboard', label: 'Dashboard' },
    { path: 'sessions', label: 'Sessions' },
  ];
}
