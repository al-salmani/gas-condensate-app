import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { DashboardComponent } from './dashboard.component';
import { FieldMapComponent } from './field-map.component';
import { UserManagementComponent } from './user-management.component';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { TokenInterceptor } from './token.interceptor';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'map', component: FieldMapComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UserManagementComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [AppComponent, LoginComponent, DashboardComponent, FieldMapComponent, UserManagementComponent],
  imports: [BrowserModule, HttpClientModule, ReactiveFormsModule, RouterModule.forRoot(routes)],
  providers: [
    AuthService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}