import { Component, OnInit } from '@angular/core';
import {Parent} from '../model/parent';
import {AuthenticationService} from '../service/auth.service';
import {Router} from '@angular/router';
import {ParentService} from '../service/parent.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CityService} from '../service/city.service';
import {City} from '../model/city';
import {ChildService} from '../service/child.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = 'admin-panel-layout';
  sideBarOpen = true;
  currentUser: Parent | null = null;
  parentCurrent: Parent;
  city: City;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
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
    if (this.currentUser && this.currentUser.iin) {
      this.getParentByIin(this.currentUser.iin);
    }
  }
  // tslint:disable-next-line:typedef
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  public getParentByIin(iin: string): void {
    this.parentService.getByUsername(iin).subscribe(
      (response: Parent) => {
        this.parentCurrent = response;
        console.log('parentCurrent: ', this.parentCurrent);
        if (this.parentCurrent.cityId) {
          this.getCity(this.parentCurrent.cityId);
        }
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  public getCity(id: number): void {
    this.cityService.getCity(id).subscribe(
      (response: City) => {
        this.city = response;
        console.log('city: ', this.city);
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }
}
