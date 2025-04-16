
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard.component';
import { FieldMapComponent } from './field-map.component';
import { LoginComponent } from './login.component';
import { UserManagementComponent } from './user-management.component';
import { FieldManagementComponent } from './field-management.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { TokenInterceptor } from './token.interceptor';



const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'field-management', component: FieldManagementComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UserManagementComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'field-map', component: FieldMapComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    AppComponent,
    UserManagementComponent,
    DashboardComponent,
	FieldManagementComponent,
    FieldMapComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
	BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
    }),
    RouterModule.forRoot(routes)
  ],
  providers: [
   AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
