import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CustomersService } from '../../services/customers.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-add-customer',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './add-customer.html',
    styleUrl: './add-customer.scss'
})
export class AddCustomer implements OnInit {
    // form fields
    name = '';
    email = '';
    phone = '';
    line1 = '';
    line2 = '';
    city = '';
    state = '';
    zip = '';

    role = '';
    errorMessage = '';

    constructor(
        private customersService: CustomersService,
        private router: Router,
        private auth: AuthService,
        private notify: NotificationService
    ) { }

    ngOnInit() {
        this.role = this.auth.getRole();
    }

    canAdd(): boolean {
        return this.role === 'admin' || this.role === 'manager';
    }

    createCustomer() {
        this.errorMessage = '';

        if (!this.canAdd()) {
            this.errorMessage = 'You do not have permission to add customers.';
            return;
        }

        if (!this.name.trim() || !this.email.trim()) {
            this.errorMessage = 'Name and Email are required.';
            return;
        }

        const payload = {
            name: this.name.trim(),
            email: this.email.trim().toLowerCase(),
            phone: this.phone?.trim(),
            address: {
                line1: this.line1?.trim(),
                line2: this.line2?.trim(),
                city: this.city?.trim(),
                state: this.state?.trim(),
                zip: this.zip?.trim()
            }
        };

        this.customersService.createCustomer(payload).subscribe({
            next: () => {
                this.notify.show('Customer added successfully!');
                this.router.navigate(['/customers']);
            },
            error: (err: any) => {
                // backend returns { error: 'Email already exists.' } with 409
                this.errorMessage = err?.error?.error || 'Failed to add customer.';
                console.error('Error creating customer:', err);
            }
        });
    }

    goBack() {
        this.router.navigate(['/customers']);
    }
}
