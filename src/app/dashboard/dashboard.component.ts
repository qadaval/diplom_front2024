import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {AddressService} from '../service/address.service';
import {DaycareService} from '../service/daycare.service';
import {Daycare} from '../model/daycare';
import {HttpErrorResponse} from '@angular/common/http';
import {Address} from '../model/address';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  title = 'admin-panel-layout';
  daycareAll = [];
  addressMap: {[key: number]: Address} = {};
  sideBarOpen = true;
  displayedColumns: string[] = ['id', 'name', 'bin', 'addressId', 'capacity', 'emptyPlaces', 'enroll'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataSource = new MatTableDataSource<Daycare>();
  loading = false;
  filterValues: { [key: string]: string } = {};
  constructor(
    private addressService: AddressService, private daycareService: DaycareService, private cdr: ChangeDetectorRef
  ) { }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }
  ngOnInit(): void {
    this.getAllDaycare();
    this.loadAddress();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
    this.paginator._intl.itemsPerPageLabel = 'Items per page:';
  }
  // tslint:disable-next-line:typedef
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
    this.cdr.detectChanges();
  }
  public getAllDaycare(): void {
    this.daycareService.getAllDaycare().subscribe(
      (response: Daycare[]) => {
        this.daycareAll = response;
        this.dataSource.data = this.daycareAll;
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
    }
    );
  }
  public loadAddress(): void {
    this.addressService.getAllAddress().subscribe(addressAll => {
      addressAll.forEach(address => {
        this.addressMap[address.id] = address;
        console.log(this.addressMap);
      });
    });
  }

  getAddressString(addressId: number): string {
    const address = this.addressMap[addressId];
    return address ? `${address.region}, ${address.city}, ${address.district}, ${address.street}, ${address.house}` : 'Undefined';
  }
}
