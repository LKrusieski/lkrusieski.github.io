import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CustomersService, Customer } from '../../services/customers.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-customer-detail',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './customer-detail.html',
    styleUrl: './customer-detail.scss'
})
export class CustomerDetail implements OnInit {
    customerId = '';
    customer: Customer | null = null;

    // editable fields
    name = '';
    email = '';
    phone = '';
    line1 = '';
    line2 = '';
    city = '';
    state = '';
    zip = '';

    errorMessage = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private customersService: CustomersService,
        public auth: AuthService,
        private notify: NotificationService
    ) { }

    ngOnInit() {
        this.customerId = this.route.snapshot.paramMap.get('id') || '';
        if (!this.customerId) {
            this.errorMessage = 'Missing customer id.';
            return;
        }
        this.load();
    }

    canEdit() {
        const r = this.auth.getRole();
        return r === 'admin' || r === 'manager';
    }

    canDelete() {
        return this.auth.getRole() === 'admin';
    }

    load() {
        this.customersService.getCustomer(this.customerId).subscribe({
            next: (c) => {
                this.customer = c;
                this.name = c.name || '';
                this.email = c.email || '';
                this.phone = c.phone || '';

                this.line1 = c.address?.line1 || '';
                this.line2 = c.address?.line2 || '';
                this.city = c.address?.city || '';
                this.state = c.address?.state || '';
                this.zip = c.address?.zip || '';
            },
            error: (err) => {
                this.errorMessage = err?.error?.error || 'Failed to load customer.';
            }
        });
    }

    save() {
        if (!this.canEdit()) return;

        this.errorMessage = '';
        if (!this.name.trim() || !this.email.trim()) {
            this.errorMessage = 'Name and Email are required.';
            return;
        }

        const payload: Partial<Customer> = {
            name: this.name.trim(),
            email: this.email.trim(),
            phone: this.phone?.trim(),
            address: {
                line1: this.line1?.trim(),
                line2: this.line2?.trim(),
                city: this.city?.trim(),
                state: this.state?.trim(),
                zip: this.zip?.trim()
            }
        };

        this.customersService.updateCustomer(this.customerId, payload).subscribe({
            next: () => {
                this.notify.show('Customer updated successfully!');
                this.router.navigate(['/customers']);
            },
            error: (err) => {
                this.errorMessage = err?.error?.error || 'Failed to update customer.';
            }
        });
    }

    delete() {
        if (!this.canDelete()) return;

        this.customersService.deleteCustomer(this.customerId).subscribe({
            next: () => {
                this.notify.show('Customer deleted.');
                this.router.navigate(['/customers']);
            },
            error: (err) => {
                this.errorMessage = err?.error?.error || 'Failed to delete customer.';
            }
        });
    }

    goBack() {
        this.router.navigate(['/customers']);
    }
}
