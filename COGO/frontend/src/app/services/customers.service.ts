import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Customer {
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    address?: {
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        zip?: string;
    };
}

@Injectable({ providedIn: 'root' })
export class CustomersService {
    private baseUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) { }

    getCustomers() {
        return this.http.get<Customer[]>(`${this.baseUrl}/customers`);
    }

    getCustomer(id: string) {
        return this.http.get<Customer>(`${this.baseUrl}/customers/${id}`);
    }

    updateCustomer(id: string, payload: Partial<Customer>) {
        return this.http.put<Customer>(`${this.baseUrl}/customers/${id}`, payload);
    }

    deleteCustomer(id: string) {
        return this.http.delete(`${this.baseUrl}/customers/${id}`);
    }

    createCustomer(payload: any) {
        return this.http.post(`${this.baseUrl}/customers`, payload);
    }

}
