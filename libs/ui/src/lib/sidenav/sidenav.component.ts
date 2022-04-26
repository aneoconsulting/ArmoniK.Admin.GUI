import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'ui-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
  @HostBinding('class.sidenav') className = true;
}
