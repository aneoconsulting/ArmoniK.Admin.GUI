import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

export const ResultsAccessGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  const userPermissions = userService.user?.permissions ?? [];
  
  const hasAccess = userPermissions.some(permission => 
    permission === 'Results:ListResults' ||
    permission === 'Results:GetResult'
  );

  if (!hasAccess) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};