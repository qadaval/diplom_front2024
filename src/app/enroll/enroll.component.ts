import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DaycareService } from '../service/daycare.service';
import { Daycare } from '../model/daycare';
import { HttpErrorResponse } from '@angular/common/http';
import { Address } from '../model/address';
import { AddressService } from '../service/address.service';
import { CityService } from '../service/city.service';
import { City } from '../model/city';
import { AuthenticationService } from '../service/auth.service';
import { Parent } from '../model/parent';
import { ParentService } from '../service/parent.service';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { RequestService } from '../service/request.service';
import { Request } from '../model/request';

@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.component.html',
  styleUrls: ['./enroll.component.scss']
})
export class EnrollComponent implements OnInit {
  sideBarOpen = true;
  daycareId: string;
  daycare: Daycare;
  addressMap: { [key: number]: Address } = {};
  cityAll: City[] = [];
  currentUser: Parent;
  parentCurrent: Parent;
  requestAll: Request[] = [];
  enrollForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private daycareService: DaycareService,
    private addressService: AddressService,
    private cityService: CityService,
    private authService: AuthenticationService,
    private parentService: ParentService,
    private router: Router,
    private formBuilder: FormBuilder,
    private requestService: RequestService
  ) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  // tslint:disable-next-line:typedef
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  ngOnInit(): void {
    if (this.currentUser.iin && this.currentUser) {
      this.getParentByIin(this.currentUser.iin);
    }
    this.route.paramMap.subscribe(params => {
      this.daycareId = params.get('id');
    });
    this.getDaycare(this.daycareId);
    this.getAllCity();
    this.loadAddress();
    this.enrollForm = this.formBuilder.group({
      children: this.formBuilder.array([], Validators.required)
    });
    this.getAllRequest();
  }

  public getDaycare(id: string): any {
    this.daycareService.getDaycare(id).subscribe(
      (response) => {
        this.daycare = response;
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  public getParentByIin(iin: string): void {
    this.parentService.getByUsername(iin).subscribe(
      (response: Parent) => {
        this.parentCurrent = response;
        console.log('parentCurrent: ', this.parentCurrent);
        this.addCheckboxes();
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  public getAllCity(): void {
    this.cityService.getAllCity().subscribe(
      (response: City[]) => {
        this.cityAll = response;
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  public loadAddress(): void {
    this.addressService.getAllAddress().subscribe(addressAll => {
      addressAll.forEach(address => {
        this.addressMap[address.id] = address;
      });
      console.log('AddressMap: ', this.addressMap);
    });
  }

  getAddressString(addressId: number): string {
    const address = this.addressMap[addressId];
    // tslint:disable-next-line:max-line-length
    return address ? `${address.region}, ${this.cityAll[address.cityId - 1].name}, ${address.district}, ${address.street}, ${address.house}` : 'Undefined';
  }

  public getAllRequest(): void {
    this.requestService.getAllRequest().subscribe(
      (response) => {
        this.requestAll = response;
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  // tslint:disable-next-line:typedef
  private addCheckboxes() {
    this.parentCurrent.children.forEach((child, i) => {
      if (!this.isChildInRequests(child.id)) {
        const control = new FormControl(false); // Initially unselected
        (this.enrollForm.controls.children as FormArray).push(control);
      }
    });
  }

  // tslint:disable-next-line:typedef
  onCheckboxChange(event: any, index: number) {
    const children = this.enrollForm.controls.children as FormArray;

    if (event.target.checked) {
      children.controls.forEach((ctrl, i) => {
        if (i !== index) {
          ctrl.setValue(false); // Deselect all other checkboxes
        }
      });
      children.at(index).setValue(true); // Select the current checkbox
    } else {
      children.at(index).setValue(false); // Unselect the current checkbox
    }
  }

  // tslint:disable-next-line:typedef
  onSubmit() {
    const selectedChildIndex = this.enrollForm.value.children.findIndex(value => value);
    const selectedChildId: number = this.parentCurrent.children[selectedChildIndex]?.id;
    const data: Request = {
      dateOfRequest: new Date(),
      parentId: this.parentCurrent?.id,
      childId: selectedChildId,
      isApproved: false
    };
    console.log('Selected child ID:', selectedChildId);
    this.requestService.addRequest(data).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['/home']);
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  public isChildInRequests(childId: number): boolean {
    return this.requestAll.some(request => request.childId === childId);
  }

  public areAllChildrenRegistered(): boolean {
    return this.parentCurrent?.children.every(child => this.isChildInRequests(child.id));
  }
}
