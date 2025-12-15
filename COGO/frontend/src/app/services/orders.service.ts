import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItem {
    sku: string;
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    _id?: string;
    customerId: any; // string or populated customer object
    items: OrderItem[];
    status: 'pending' | 'paid' | 'shipped' | 'cancelled';
    total: number;
    createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
    private baseUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) { }

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.baseUrl}/orders`);
    }

    getOrder(id: string): Observable<Order> {
        return this.http.get<Order>(`${this.baseUrl}/orders/${id}`);
    }

    createOrder(payload: Partial<Order>) {
        return this.http.post(`${this.baseUrl}/orders`, payload);
    }

    updateOrder(id: string, payload: Partial<Order>) {
        return this.http.put(`${this.baseUrl}/orders/${id}`, payload);
    }

    deleteOrder(id: string) {
        return this.http.delete(`${this.baseUrl}/orders/${id}`);
    }
}
