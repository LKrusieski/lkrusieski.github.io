import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SearchService } from '../../services/search.service';
import { NotificationService } from '../../services/notification.service';
import { OrdersService, Order} from '../../services/orders.service';

@Component({
    selector: 'app-order-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './order-list.html',
    styleUrl: './order-list.scss'
})
export class OrderList implements OnInit {

    orders: any[] = [];
    searchTerm: string = '';
    sortOption: string = 'newest';

    constructor(
        private ordersService: OrdersService,
        private router: Router,
        private searchService: SearchService,
        private notify: NotificationService
    ) { }

    ngOnInit() {
        this.ordersService.getOrders().subscribe({
            next: (data: Order[]) => {
                this.orders = data;
            },
            error: (err: any) => {
                this.notify.show('Error loading orders.');
                console.error('Error loading orders:', err);
            }
        });

    }

    get filteredOrders() {
        let result = [...this.orders];

        // Apply search filter
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            result = result.filter(o =>
                (o.status || '').toLowerCase().includes(term) ||
                // if populated customerId is an object, this supports searching customer name/email
                (o.customerId?.name || '').toLowerCase().includes(term) ||
                (o.customerId?.email || '').toLowerCase().includes(term) ||
                // search by sku in items
                (o.items || []).some((it: any) => (it.sku || '').toLowerCase().includes(term))
            );
        }

        // Apply sorting
        switch (this.sortOption) {
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case 'totalAsc':
                result.sort((a, b) => (a.total ?? 0) - (b.total ?? 0));
                break;
            case 'totalDesc':
                result.sort((a, b) => (b.total ?? 0) - (a.total ?? 0));
                break;
            case 'statusAsc':
                result.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
                break;
        }

        return result;
    }

    viewOrder(order: any) {
        this.router.navigate(['/orders', order._id]);
    }
}
