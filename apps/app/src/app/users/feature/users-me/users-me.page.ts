import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrowserTitleService, LanguageService } from '../../../shared/util';
import { Observable, tap } from 'rxjs';
import { User } from '@armonik.admin.gui/shared/data-access';
import { AuthService } from '../../../shared/data-access/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users-me',
  templateUrl: './users-me.page.html',
  styleUrls: ['./users-me.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersMeComponent {
  constructor(
    private _route: ActivatedRoute,
    private _languageService: LanguageService,
    private _browserTitleService: BrowserTitleService,
    private _authService: AuthService
  ) {
    this._browserTitleService.setTitle(
      this._languageService.instant('pages.users_me.title')
    );
  }

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
