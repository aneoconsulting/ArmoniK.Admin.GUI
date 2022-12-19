import { Injectable } from '@angular/core';
import { User } from '@armonik.admin.gui/shared/data-access';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthService {
  private _user = new BehaviorSubject<User | null>(null);

  public set user(user: User | null) {
    this._user.next(user);
  }

  public get user() {
    return this._user.getValue();
  }

  public get user$() {
    return this._user.asObservable();
  }
}
