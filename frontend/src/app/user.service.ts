// user.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateRole(id: number, role: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/role`, { role });
  }

  updatePassword(id: number, password: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/password`, { password });
  }

  addUser(username: string, password: string, role: string): Observable<any> {
	  return this.http.post(`${this.apiUrl}/create`, { username, password, role });
  }
}
