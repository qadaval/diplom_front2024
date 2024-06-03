import { Component, OnInit } from '@angular/core';
import {Parent} from '../model/parent';
import {AuthenticationService} from '../service/auth.service';
import {Router} from '@angular/router';
import {ParentService} from '../service/parent.service';
import {HttpErrorResponse} from '@angular/common/http';
import {CityService} from '../service/city.service';
import {City} from '../model/city';
import {RequestService} from '../service/request.service';
import {Request} from '../model/request';
import {Daycare} from '../model/daycare';
import {DaycareService} from '../service/daycare.service';
import {ChildService} from '../service/child.service';
import {Child} from '../model/child';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = 'admin-panel-layout';
  sideBarOpen = true;
  requestAll: Request[] = [];
  currentUser: Parent | null = null;
  parentCurrent: Parent;
  city: City;
  daycareAll: Daycare[] = [];
  requestNum = 0;
  filterRequestAll: Request[] = [];
  childAll: Child[] = [];

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private parentService: ParentService,
    private cityService: CityService,
    private requestService: RequestService,
    private daycareService: DaycareService,
    private childService: ChildService
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
    this.getAllRequest();
    this.getAllDaycare();
    this.getAllChild();
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
  public getAllDaycare(): any {
    this.daycareService.getAllDaycare().subscribe(
      (response) => {
        this.daycareAll = response;
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
  public getAllChild(): void {
    this.childService.getAllChild().subscribe(
      (response) => {
        this.childAll = response;
        console.log('CHILDREN NAXUIIIII', this.childAll);
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }
  public getChildDataById(childId: number): string {
    const child = this.childAll.find(c => c.id === childId);
    return child ? child.surname + ' ' + child.name + ' ' + child.f_name : 'Неизвестно';
  }
  public getAllRequest(): void {
    this.requestService.getAllRequest().subscribe(
      (response) => {
        this.requestAll = response;
        this.updateRequestNumber();
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  public updateRequestNumber(): void {
    this.filterRequestAll = this.requestAll.filter(req => req.parentId === this.parentCurrent?.id);
    console.log('REQUEST AUTHORS NOTE NAXUIIIII: ', this.filterRequestAll);
    this.requestNum = this.requestAll.filter(req => req.parentId === this.parentCurrent?.id).length;
    console.log(this.requestNum);
  }

  public requestNumber(): number {
    return this.requestNum;
  }
}
