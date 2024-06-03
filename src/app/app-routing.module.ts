import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './auth.guard';
import {SidenavComponent} from './sidenav/sidenav.component';
import {RegisterComponent} from './register/register.component';
import {ChildRegistrationComponent} from './child-registration/child-registration.component';
import {EnrollComponent} from './enroll/enroll.component';
import {HelpComponent} from './help/help.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '', canActivate: [AuthGuard], component: HomeComponent},
  { path: 'home', canActivate: [AuthGuard], component: HomeComponent },
  { path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent },
  {path: 'sidenav', canActivate: [AuthGuard], component: SidenavComponent},
  {path: 'child-register', canActivate: [AuthGuard], component: ChildRegistrationComponent},
  {path: 'enroll/:id', canActivate: [AuthGuard], component: EnrollComponent},
  {path: 'help', canActivate: [AuthGuard], component: HelpComponent},
  {path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
