import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  template: `
    <h2>تسجيل الدخول</h2>
    <form (submit)="login()">
      <label>اسم المستخدم: <input [(ngModel)]="username" name="username"></label><br>
      <label>كلمة المرور: <input type="password" [(ngModel)]="password" name="password"></label><br>
      <button type="submit">دخول</button>
    </form>
    <p *ngIf="error" style="color:red;">فشل تسجيل الدخول</p>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  error = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  login(): void {
    this.http.post<any>('http://localhost:5000/api/auth/login', {
      username: this.username,
      passwordHash: this.password
    }).subscribe({
      next: (res) => {
        // تأكد أن الـ backend يرجع username ضمن الاستجابة
		this.authService.login(res.token, res.username, res.role);
        this.router.navigate(['/dashboard']);
      },
      error: () => this.error = true
    });
  }
}
