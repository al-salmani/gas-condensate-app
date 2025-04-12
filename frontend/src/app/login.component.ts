import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  template: `
  <h2>Login</h2>
  <form [formGroup]="form" (ngSubmit)="login()">
    <input formControlName="username" placeholder="Username" />
    <input formControlName="password" placeholder="Password" type="password" />
    <button type="submit">Login</button>
  </form>
  `
})
export class LoginComponent {
  form: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({ username: '', password: '' });
  }

  login() {
    const { username, password } = this.form.value;
    this.auth.login(username, password).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: () => alert('Login failed')
    });
  }
}