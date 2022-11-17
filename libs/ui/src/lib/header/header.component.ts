import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClrNavigationModule } from '@clr/angular';

@Component({
  standalone: true,
  selector: 'ui-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, ClrNavigationModule],
})
export class HeaderComponent {}
