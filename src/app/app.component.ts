import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from '@components/navigation/navigation.component';

@Component({
  selector: 'app-root',
  imports: [
    NavigationComponent,
    RouterModule,
  ],
  template: `
  <app-navigation>
    <router-outlet></router-outlet>
  </app-navigation>
  `,
  standalone: true
})
export class AppComponent {
}
