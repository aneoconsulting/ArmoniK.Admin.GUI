import { User } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class AuthService {
  public loading$ = new Subject<boolean>();

  private _user = new BehaviorSubject<User | null>(null);
  private _user$ = this._user.asObservable();

  public set user(user: User | null) {
    this._user.next(user);
  }

  public get user() {
    return this._user.getValue();
  }

  public get user$() {
    return this._user$;
  }
}
