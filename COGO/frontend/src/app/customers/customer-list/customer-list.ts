import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SearchService } from '../../services/search.service';
import { NotificationService } from '../../services/notification.service';
import { CustomersService } from '../../services/customers.service';

@Component({
    selector: 'app-customer-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './customer-list.html',
    styleUrl: './customer-list.scss'
})
export class CustomerList implements OnInit {

    customers: any[] = [];
    searchTerm: string = '';
    sortOption: string = 'nameAsc';

    constructor(
        private customersService: CustomersService,
        private router: Router,
        private searchService: SearchService,
        private notify: NotificationService
    ) { }

    ngOnInit() {
        this.searchService.search$.subscribe(text => {
            this.searchTerm = text;
        });

        this.customersService.getCustomers().subscribe({
            next: (data) => {
                this.customers = data;
            },
            error: (err) => {
                this.notify.show('Error loading customers.');
                console.error('Error loading customers:', err);
            }
        });
    }

    get filteredCustomers() {
        let result = [...this.customers];

        // Apply search filter
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            result = result.filter(c =>
                (c.name || '').toLowerCase().includes(term) ||
                (c.email || '').toLowerCase().includes(term) ||
                (c.phone || '').toLowerCase().includes(term)
            );
        }

        // Apply sorting
        switch (this.sortOption) {
            case 'nameAsc':
                result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                break;
            case 'nameDesc':
                result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
                break;
            case 'emailAsc':
                result.sort((a, b) => (a.email || '').localeCompare(b.email || ''));
                break;
            case 'emailDesc':
                result.sort((a, b) => (b.email || '').localeCompare(a.email || ''));
                break;
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
        }

        return result;
    }

    viewCustomer(customer: any) {
        this.router.navigate(['/customers', customer._id]);
    }
}
