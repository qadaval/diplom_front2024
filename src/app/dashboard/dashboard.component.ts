import {AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {AddressService} from '../service/address.service';
import {DaycareService} from '../service/daycare.service';
import {Daycare} from '../model/daycare';
import {HttpErrorResponse} from '@angular/common/http';
import {Address} from '../model/address';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {CityService} from '../service/city.service';
import {City} from '../model/city';
import {AuthenticationService} from '../service/auth.service';
import {Parent} from '../model/parent';
import {Router} from '@angular/router';
import {ParentService} from '../service/parent.service';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  title = 'admin-panel-layout';
  daycareAll = [];
  cityAll: City[];
  addressMap: {[key: number]: Address} = {};
  sideBarOpen = true;
  displayedColumns: string[] = ['id', 'name', 'bin', 'addressId', 'capacity', 'emptyPlaces', 'enroll'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataSource = new MatTableDataSource<Daycare>();
  loading = false;
  parentCurrent: Parent;
  currentUser: Parent;
  // filterValues: { [key: string]: string } = {};
  constructor(
    private addressService: AddressService,
    private daycareService: DaycareService,
    private cdr: ChangeDetectorRef,
    private cityService: CityService,
    private authService: AuthenticationService,
    private parentService: ParentService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    this.cdr.markForCheck();
    this.dataSource.paginator = this.paginator;
    }
  ngOnInit(): void {
    if (this.currentUser.iin) {
      forkJoin({
        parent: this.parentService.getByUsername(this.currentUser.iin),
        addresses: this.addressService.getAllAddress(),
        cities: this.cityService.getAllCity()
      }).subscribe(
        ({ parent, addresses, cities }) => {
          this.ngZone.run(() => {
            this.parentCurrent = parent;
            this.cityAll = cities;
            addresses.forEach(address => {
              this.addressMap[address.id] = address;
            });
            this.getAllDaycare();
          });
        },
        (error: HttpErrorResponse) => {
          console.log(error.message);
        }
      );
    }
    this.getAllDaycare();
    this.getAllCity();
    this.loadAddress();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
    this.paginator._intl.itemsPerPageLabel = 'Items per page:';
  }
  public loadAddress(): void {
    this.addressService.getAllAddress().subscribe(addressAll => {
      addressAll.forEach(address => {
        this.addressMap[address.id] = address;
      });
      console.log('AddressMap: ', this.addressMap);
    });
  }
  // public getParentByIin(iin: string): void {
  //   this.parentService.getByUsername(iin).subscribe(
  //     (response: Parent) => {
  //       this.parentCurrent = response;
  //       console.log('parentCurrent: ', this.parentCurrent);
  //     }, (error: HttpErrorResponse) => {
  //       console.log(error.message);
  //     }
  //   );
  // }
  // tslint:disable-next-line:typedef
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
    this.cdr.detectChanges();
  }
  public getAllDaycare(): void {
    this.daycareService.getAllDaycare().subscribe(
      (response: Daycare[]) => {
        this.daycareAll = response;
        console.log('cityid: ', this.parentCurrent?.cityId);
        const filteredDaycares = this.daycareAll.filter(
          daycare => this.parentCurrent?.cityId === this.addressMap[daycare.addressId]?.cityId
        );
        this.dataSource.data = filteredDaycares;
        console.log('Datasource: ', this.dataSource.data);
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
  getAddressString(addressId: number): string {
    const address = this.addressMap[addressId];
    // tslint:disable-next-line:max-line-length
    return address ? `${address.region}, ${this.cityAll[address.cityId - 1].name}, ${address.district}, ${address.street}, ${address.house}` : 'Undefined';
  }
}
