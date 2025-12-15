import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.getRole() === 'admin') return true;
    return router.parseUrl('/items');
};
