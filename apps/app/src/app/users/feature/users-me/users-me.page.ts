import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '@armonik.admin.gui/shared/data-access';
import { AuthService } from '../../../shared/data-access/auth.service';

@Component({
  selector: 'app-users-me',
  templateUrl: './users-me.page.html',
  styleUrls: ['./users-me.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersMeComponent {
  constructor(private _authService: AuthService) {}

  public get currentUser$(): Observable<User | null> {
    return this._authService.user$;
  }

  public services(permissions: string[]): string[] {
    return Array.from(
      new Set(permissions.map((permission) => permission.split(':')[0]))
    );
  }

  public permissionsByServices(
    permissions: string[],
    service: string
  ): string[] {
    return permissions.filter((permission) => permission.startsWith(service));
  }
}
