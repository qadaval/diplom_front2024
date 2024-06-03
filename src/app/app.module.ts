import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {AuthInterceptor} from './auth.interceptor';
import { AuthenticationService } from './service/auth.service';
import { DaycareService } from './service/daycare.service';
import { AddressService } from './service/address.service';
import { RegisterComponent } from './register/register.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ChildRegistrationComponent } from './child-registration/child-registration.component';
import { EnrollComponent } from './enroll/enroll.component';
import { HelpComponent } from './help/help.component';
import { AdminComponent } from './admin/admin.component';
import { ApproveComponent } from './admin/approve/approve.component';
import {MatDialogModule} from '@angular/material/dialog';

// @ts-ignore
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    DashboardComponent,
    SidenavComponent,
    LoginComponent,
    RegisterComponent,
    ChildRegistrationComponent,
    EnrollComponent,
    HelpComponent,
    AdminComponent,
    ApproveComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        // * MATERIAL IMPORTS
        MatSidenavModule,
        MatToolbarModule,
        MatMenuModule,
        MatIconModule,
        MatDividerModule,
        MatListModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatCheckboxModule,
        HttpClientModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatTableModule,
        FormsModule,
        MatDatepickerModule,
        MatDialogModule
    ],
  providers: [
    AuthenticationService,
    DaycareService,
    AddressService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
