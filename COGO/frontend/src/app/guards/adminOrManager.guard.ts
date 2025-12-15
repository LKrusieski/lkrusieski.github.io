import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminOrManagerGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const role = auth.getRole(); // reads sessionStorage role, or decodes token

    if (role === 'admin' || role === 'manager') return true;

    // If logged in but insufficient role, don't send them to login
    router.navigate(['/items']);
    return false;
};
