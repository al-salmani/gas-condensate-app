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
  login(token: string, username: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
    this.loggedIn.next(true);
  }

  // تنفيذ عند تسجيل الخروج
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    this.loggedIn.next(false);
  }

  // جلب اسم المستخدم المسجل
  getUsername(): string | null {
    return localStorage.getItem('username');
  }
  
    // جلب صلاحيات المستخدم المسجل
  getRole(): string | null {
    return localStorage.getItem('role');
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
