
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from './services/api.service';

export const adminGuard: CanActivateFn = () => {
  const api = inject(ApiService);
  const router = inject(Router);

  if (api.isAdminAuthenticated()) {
    return true; 
  } else {
    router.navigate(['/login']); 
    
    return false;
  }
};
