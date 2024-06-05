import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RequestService} from '../../service/request.service';
import {Request} from '../../model/request';
import {HttpErrorResponse} from '@angular/common/http';
import {ParentService} from '../../service/parent.service';
import {DaycareService} from '../../service/daycare.service';
import {Parent} from '../../model/parent';
import {Child} from '../../model/child';
import {Daycare} from '../../model/daycare';
import {ChildService} from '../../service/child.service';
import {Address} from '../../model/address';
import {AddressService} from '../../service/address.service';
import {CityService} from '../../service/city.service';
import {City} from '../../model/city';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.scss']
})
export class ApproveComponent implements OnInit{
  parent: Parent;
  child: Child;
  daycare: Daycare;
  address: Address;
  city: City;
  constructor(
    private parentService: ParentService,
    private daycareService: DaycareService,
    private childService: ChildService,
    private requestService: RequestService,
    private addressService: AddressService,
    private cityService: CityService,
    public dialogRef: MatDialogRef<ApproveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.getParent(this.data.parentId);
    this.getChild(this.data.childId);
    this.getDaycare(this.data.daycareId);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  approveRequest(): void {
    this.updateRequest(this.data);
  }
  public updateRequest(request: Request): void {
    this.requestService.updateRequest(request).subscribe(
      (response) => {
        console.log(response);
        this.dialogRef.close();
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }
  public getParent(id: number): any {
    this.parentService.getParent(id).subscribe(
      (response) => {
        this.parent = response;
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }
  public getChild(id: number): any {
    this.childService.getChild(id).subscribe(
      (response) => {
        this.child = response;
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }
  public getDaycare(id: string): any {
    this.daycareService.getDaycare(id).subscribe(
      (response) => {
        this.daycare = response;
        this.getAddress(this.daycare.addressId);
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }
  public getAddress(id: number): any {
    this.addressService.getAddress(id).subscribe(
      (response) => {
        this.address = response;
        this.getCity(this.address.cityId);
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }
  public getCity(id: number): any {
    this.cityService.getCity(id).subscribe(
      (response) => {
        this.city = response;
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }
}

