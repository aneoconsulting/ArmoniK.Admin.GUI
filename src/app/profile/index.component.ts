import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '@components/page-header.component';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-profile-index',
  template: `
<app-page-header>
  <mat-icon matListItemIcon aria-hidden="true" fontIcon="account_circle"></mat-icon>
  <span matListItemTitle> Profile </span>
</app-page-header>

<!-- TODO: Create a usable profile with a more understanding permissions labels -->
<pre>
{{ user | json }}
</pre>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [],
  imports: [
    JsonPipe,
    PageHeaderComponent,
    MatIconModule,
  ]
})
export class IndexComponent {
  constructor(
    private _userService: UserService
  ) { }

  get user() {
    return this._userService.user;
  }
}
