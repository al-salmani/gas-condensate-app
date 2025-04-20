import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  template: `
    <h1>نظام إدارة حقول الغاز</h1>

    <!-- ترحيب و زر الخروج -->
    <div *ngIf="isLogged" style="margin-bottom: 10px;">
      👋 مرحبًا {{ getUsername() }} |
      <button (click)="logout()">تسجيل الخروج</button>
    </div>

    <!-- شريط التنقل -->
    <nav>
      <a *ngIf="!isLogged" routerLink="/login">تسجيل الدخول</a> |
      <a *ngIf="isLogged" routerLink="/users">إدارة المستخدمين</a> |
      <a *ngIf="isLogged" routerLink="/field-management">إدارة الحقول</a> |
      <a *ngIf="isLogged" routerLink="/dashboard">لوحة المؤشرات</a> |
      <a *ngIf="isLogged" routerLink="/field-map">الخريطة</a>
    </nav>

    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  isLogged = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // الاشتراك لتتبع حالة تسجيل الدخول
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLogged = status;

      // توجيه تلقائي لصفحة الدخول عند تسجيل الخروج
      if (!status) {
        this.router.navigate(['/login']);
      }
    });
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  logout(): void {
    this.authService.logout();
  }
}
