import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '@services/user.service';

@Injectable({
  providedIn: 'root'
})
export class TasksAccessGuard implements CanActivate {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  canActivate(): boolean {
    const permissions = this.userService.user?.permissions ?? [];
    const hasGetTaskPermission = permissions.includes('Tasks:GetTask');
    const hasListTasksPermission = permissions.includes('Tasks:ListTasks');
    const hasListTasksDetailedPermission = permissions.includes('Tasks:ListTasksDetailed');
    const hasGetResultIdPermission = permissions.includes('Tasks:GetResultId');

    if (!hasGetTaskPermission && !hasListTasksPermission && !hasListTasksDetailedPermission && !hasGetResultIdPermission) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}