import { User } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';

export interface IUserService {
  user: User.AsObject | undefined;
  hasPermission(permission: string): boolean;
}

@Injectable()
export class UserService implements IUserService {
  private _user: User.AsObject | undefined;

  set user(userData: User.AsObject | undefined) {
    if (userData) {
      const filteredPermissions = userData.permissions?.filter(
        (permission: string) => {
          return (
            !permission.includes('no permissions')
          );
        }
      ) ?? [];
      this._user = {
        ...userData,
        permissions: filteredPermissions
      };
    } else {
      this._user = userData;
    }
  }

  get user(): User.AsObject | undefined {
    return this._user;
  }

  hasPermission(permission: string): boolean {
    return this._user?.permissions?.includes(permission) ?? false;
  }
}