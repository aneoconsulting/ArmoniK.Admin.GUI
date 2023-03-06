import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import {
  ApplicationsClient,
  PartitionsClient,
  ResultsClient,
  SessionsClient,
  TasksClient,
} from '@aneoconsultingfr/armonik.api.angular';

// type Service<T extends string> = T extends `${infer S}Client` ? S : never;
type Action<T> = Capitalize<Exclude<keyof T, '$raw'> & string>;

@Injectable()
export class AuthorizationService {
  constructor(private _authService: AuthService) {}

  public canListApplications(): boolean {
    return this._can<ApplicationsClient>('ListApplications', 'Applications');
  }

  public canListSessions(): boolean {
    return this._can<SessionsClient>('ListSessions', 'Sessions');
  }

  public canCancelSession(): boolean {
    return this._can<SessionsClient>('CancelSession', 'Sessions');
  }

  public canListResults(): boolean {
    return this._can<ResultsClient>('ListResults', 'Results');
  }

  public canListTasks(): boolean {
    return this._can<TasksClient>('ListTasks', 'Tasks');
  }

  public canCancelTasks(): boolean {
    return this._can<TasksClient>('CancelTasks', 'Tasks');
  }

  public canListPartitions(): boolean {
    return this._can<PartitionsClient>('ListPartitions', 'Partitions');
  }

  private _can<T>(action: Action<T>, service: string): boolean {
    const user = this._authService.user;
    if (!user) {
      return false;
    }

    const permissions = user.permissions;
    if (!permissions) {
      return false;
    }

    const permission = permissions.find((p) => p === `${service}:${action}`);
    return !!permission;
  }
}
