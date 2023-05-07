import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GrpcCoreModule } from '@ngx-grpc/core';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule
  ],
  template: `
  <router-outlet></router-outlet>
  `,
  standalone: true
})
export class AppComponent {
}
