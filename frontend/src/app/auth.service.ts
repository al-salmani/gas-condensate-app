import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  // Observable للربط مع المكونات
  get isLoggedIn$() {
    return this.loggedIn.asObservable();
  }

  // فحص وجود التوكن
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // تنفيذ عند تسجيل الدخول
  login(token: string) {
    localStorage.setItem('token', token);
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    localStorage.setItem('role', tokenPayload['role'] || tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
    localStorage.setItem('username', tokenPayload['name'] || tokenPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']);
    this.loggedIn.next(true);
  }

  
  // تنفيذ عند تسجيل الخروج
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    this.loggedIn.next(false);
  }

  

  // دعم لمن يستخدم دالة مباشرة دون الـ observable
  isLoggedIn(): boolean {
    return this.hasToken();
  }

  // جلب التوكن
  getToken(): string | null {
    return localStorage.getItem('token');
    
  }
}
