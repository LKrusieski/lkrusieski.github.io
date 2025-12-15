import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ItemsService {

    private apiUrl = 'http://localhost:3000/items';

    constructor(private http: HttpClient) { }

    getItems() {
        return this.http.get<any[]>(this.apiUrl);
    }

    getItem(id: string) {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createItem(item: any) {
        return this.http.post<any>(this.apiUrl, item);
    }

    updateItem(id: string, item: any) {
        return this.http.put<any>(`${this.apiUrl}/${id}`, item);
    }

    deleteItem(id: string) {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

}
