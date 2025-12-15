import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { OrdersService, Order } from '../../services/orders.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-order-detail',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './order-detail.html',
    styleUrl: './order-detail.scss'
})
export class OrderDetail implements OnInit {
    orderId = '';
    order: Order | null = null;

    // editable
    status: Order['status'] = 'pending';

    errorMessage = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private ordersService: OrdersService,
        public auth: AuthService,
        private notify: NotificationService
    ) { }

    ngOnInit() {
        this.orderId = this.route.snapshot.paramMap.get('id') || '';
        if (!this.orderId) {
            this.errorMessage = 'Missing order id.';
            return;
        }
        this.load();
    }

    canEdit(): boolean {
        const r = this.auth.getRole();
        return r === 'admin' || r === 'manager';
    }

    canDelete(): boolean {
        return this.auth.getRole() === 'admin';
    }

    load() {
        this.ordersService.getOrder(this.orderId).subscribe({
            next: (o: Order) => {
                this.order = o;
                this.status = o.status;
            },
            error: (err: any) => {
                this.errorMessage = err?.error?.error || 'Failed to load order.';
                console.error('Error loading order:', err);
            }
        });
    }

    saveStatus() {
        if (!this.canEdit()) return;

        this.errorMessage = '';
        this.ordersService.updateOrder(this.orderId, { status: this.status }).subscribe({
            next: () => {
                this.notify.show('Order updated successfully!');
                this.router.navigate(['/orders']);
            },
            error: (err: any) => {
                this.errorMessage = err?.error?.error || 'Failed to update order.';
                console.error('Error updating order:', err);
            }
        });
    }

    deleteOrder() {
        if (!this.canDelete()) return;

        this.errorMessage = '';
        this.ordersService.deleteOrder(this.orderId).subscribe({
            next: () => {
                this.notify.show('Order deleted.');
                this.router.navigate(['/orders']);
            },
            error: (err: any) => {
                this.errorMessage = err?.error?.error || 'Failed to delete order.';
                console.error('Error deleting order:', err);
            }
        });
    }

    goBack() {
        this.router.navigate(['/orders']);
    }

    // Convenience: compute line total
    lineTotal(it: any): number {
        const q = Number(it?.quantity ?? 0);
        const p = Number(it?.price ?? 0);
        return q * p;
    }
}
