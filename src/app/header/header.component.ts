import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from '../service/auth.service';
import {Parent} from '../model/parent';
import {ParentService} from '../service/parent.service';
import {HttpErrorResponse} from '@angular/common/http';
import {CityService} from '../service/city.service';
import {City} from '../model/city';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();
  currentUser: Parent;
  parentCurrent: Parent;
  city: City;
  isAdmin = false;
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private parentService: ParentService,
    private cityService: CityService
    ) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit(): void {
    this.getParentByIin(this.currentUser.iin);
    const currentUser = this.authService.currentUserValue;
    this.isAdmin = currentUser && currentUser.roles.some(role => role.name === 'ROLE_ADMIN');
  }

  public getParentByIin(iin: string): void {
    this.parentService.getByUsername(iin).subscribe(
      (response: Parent) => {
        this.parentCurrent = response;
        if (this.parentCurrent.cityId) {
          this.getCity(this.parentCurrent.cityId);
        }
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }
  // tslint:disable-next-line:typedef
  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }
  // tslint:disable-next-line:typedef
  logout() {
    this.authService.logout();
  }
  public getCity(id: number): void {
    this.cityService.getCity(id).subscribe(
      (response) => {
        this.city = response;
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }
}
