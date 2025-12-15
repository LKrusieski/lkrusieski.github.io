import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserDto {
  _id: string;
  username: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  list(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.baseUrl}/users`);
  }

  create(payload: { username: string; password: string; role: string }) {
    return this.http.post(`${this.baseUrl}/users`, payload);
  }

  update(id: string, payload: { role?: string; password?: string }) {
    return this.http.put(`${this.baseUrl}/users/${id}`, payload);
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }
}
